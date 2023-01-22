import { spawn } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { io } from "socket.io-client";
import { env } from "../../../env/server.mjs";

const socket = io("http://localhost:3001");

const timestampsCache: Set<string> = new Set();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Disable CORS
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "*");
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	if (isSlackChallenge(req.body)) {
		const { challenge } = req.body;
		res.status(200).json({ challenge });
	}

	if (isSlackEvent(req.body)) {
		const message = req.body;

		try {
			const user = await getUser(message.event.user);
			const channel = await getChannel(message.event.channel);
			const text = await getText(message.event.text);
			const timestamp = message.event.ts;

			const data = {
				...user,
				...channel,
				text,
				timestamp,
			};

			const child = spawn("python", ["./src/python/process.py", JSON.stringify(data)]);

			// Only capture the first message for each timestamp
			if (timestampsCache.has(timestamp)) {
				return;
			}
			timestampsCache.add(timestamp);
			console.log(timestampsCache);

			child.stdout.once("data", (data: Buffer) => {
				const response = JSON.parse(data.toString()) as {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					[key: string]: any;
				};
				console.info("Sending to Web Socket");
				socket.emit("message", response);
			});
		} catch (error) {
			console.error(error);
		}
		res.status(200).end();
	}
	res.status(404).end();
}

type SlackChallenge = {
	token: string;
	challenge: string;
	type: "url_verification";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSlackChallenge(body: any): body is SlackChallenge {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return body.type === "url_verification";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSlackEvent(body: any): body is SlackEvent {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return body.type === "event_callback";
}

type SlackEvent = {
	token: string;
	team_id: string;
	context_team_id: string;
	context_enterprise_id: string | null;
	api_app_id: string;
	event: {
		client_msg_id: string;
		type: string;
		text: string;
		user: string;
		ts: string;
		blocks: {
			type: string;
			block_id: string;
			text: {
				type: string;
				text: string;
				emoji: boolean;
			};
			elements: {
				type: string;
				url: string;
			}[];
		}[];
		team: string;
		channel: string;
		event_ts: string;
		channel_type: string;
	};
	type: string;
	event_id: string;
	event_time: number;
	authorizations: {
		enterprise_id: string | null;
		team_id: string;
		user_id: string;
		is_bot: boolean;
		is_enterprise_install: boolean;
	}[];
	is_ext_shared_channel: boolean;
	event_context: string;
};

async function getUser(userId: string) {
	const response = await fetch("https://slack.com/api/users.profile.get", {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${env.SLACK_USER_TOKEN}`,
		},
		body: JSON.stringify({
			user: userId,
		}),
	});
	const identity = (await response.json()) as SlackProfileResponse;
	const { profile } = identity;
	const { real_name, display_name, first_name, last_name, image_original } = profile;
	return { real_name, display_name, first_name, last_name, image_original };
}

type SlackProfileResponse = {
	ok: boolean;
	profile: SlackProfile;
};

type SlackProfile = {
	title: string;
	phone: string;
	skype: string;
	real_name: string;
	real_name_normalized: string;
	display_name: string;
	display_name_normalized: string;
	fields: Record<string, string>;
	status_text: string;
	status_emoji: string;
	status_emoji_display_info: string[];
	status_expiration: number;
	avatar_hash: string;
	image_original: string;
	is_custom_image: boolean;
	email: string;
	first_name: string;
	last_name: string;
	image_24: string;
	image_32: string;
	image_48: string;
	image_72: string;
	image_192: string;
	image_512: string;
	image_1024: string;
	status_text_canonical: string;
};

async function getChannel(channelId: string) {
	const response = await fetch(
		`https://slack.com/api/conversations.info?${new URLSearchParams({
			channel: channelId,
		}).toString()}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
			},
		},
	);
	const conversations = (await response.json()) as SlackChannelResponse;
	const { name: channel = "", purpose: { value: purpose } = { value: "" } } = conversations.channel;
	return { channel, purpose };
}

type SlackChannelResponse = {
	ok: boolean;
	channel: SlackChannel;
};

type SlackChannel = {
	id: string;
	name: string;
	is_channel: boolean;
	is_group: boolean;
	is_im: boolean;
	is_mpim: boolean;
	is_private: boolean;
	created: number;
	is_archived: boolean;
	is_general: boolean;
	unlinked: number;
	name_normalized: string;
	is_shared: boolean;
	is_org_shared: boolean;
	is_pending_ext_shared: boolean;
	pending_shared: any[];
	context_team_id: string;
	updated: number;
	parent_conversation: null;
	creator: string;
	is_read_only: boolean;
	is_thread_only: boolean;
	is_non_threadable: boolean;
	is_ext_shared: boolean;
	shared_team_ids: string[];
	pending_connected_team_ids: any[];
	is_member: boolean;
	topic: {
		value: string;
		creator: string;
		last_set: number;
	};
	purpose: {
		value: string;
		creator: string;
		last_set: number;
	};
	previous_names: any[];
};

// Find all of the user mentions in the text
// Build an index of the real user names asynchronously
// Replace the user mentions with the real user names synchronously
async function getText(text: string) {
	const userMentions = text?.match(/<@([A-Z0-9]+)>/g);
	if (!userMentions) {
		return text;
	}
	const index = await Promise.all(
		userMentions.map(mention => {
			const userId = mention.replace(/[<@>]/g, "");
			return getUser(userId);
		}),
	);
	const userNames = index.map(({ real_name }) => real_name);
	return userMentions.reduce((text, mention, index) => {
		return text.replace(mention, `@${userNames[index] ?? "Unknown User"}`);
	}, text);
}
