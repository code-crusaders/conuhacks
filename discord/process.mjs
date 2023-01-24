import { spawn } from "child_process";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.on("ready", () => {
	console.log("Discord bot is listening!");
});

client.on("messageCreate", async message => {
	if (message.author.bot) return;

	if (!message.guildId) return;
	const guild = client.guilds.cache.get(message.guildId);
	const { username } = message.author;
	const avatar = message.author.displayAvatarURL();
	const roles = guild?.roles.cache.filter(r => r.members.has(message.author.id)).map(r => r.name);
	const channel = guild?.channels.cache.filter(c => c.id === message.channelId);
	const text = message.content.replace(/@(\d+)/g, (match, id) => {
		const user = client.users.cache.get(id);
		return user ? `@${user.username}` : match;
	});
	const timestamp = message.createdAt;

	const data = {
		username,
		avatar,
		roles,
		channel: {
			name: channel?.name,
			description: channel?.topic,
		},
		text,
		// Convert to epoch timestamp
		timestamp: timestamp.getTime() / 1000,
	};

	spawn("python", ["./python/process.py", JSON.stringify(data)]);
	console.log("Message sent to Python", data);
});

client.login(process.env.DISCORD_TOKEN);
