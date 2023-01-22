import { spawn } from "child_process";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import io from "socket.io-client";
dotenv.config();

const socket = io("http://localhost:3001");

const timestampsCache = new Set();

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.on("ready", () => {
	console.log("Discord bot is listening!");
});

client.on("messageCreate", message => {
	if (message.author.bot) return;

	if (!message.guildId) return;
	const guild = client.guilds.cache.get(message.guildId);
	const { username } = message.author;
	const avatar = message.author.displayAvatarURL();
	const roles = guild?.roles.cache.filter(r => r.members.has(message.author.id)).map(r => r.name);
	const channel = guild?.channels.cache.filter(c => c.id === message.channelId);
	const channelName = channel?.name;
	const channelDescription = channel?.topic;
	const text = message.content;
	const timestamp = message.createdAt;

	const data = {
		username,
		avatar,
		roles,
		channelName,
		channelDescription,
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

	child.stdout.once("data", data => {
		const response = JSON.parse(data.toString());
		console.info("Sending to Web Socket");
		socket.emit("message", response);
	});
});

client.login(process.env.DISCORD_TOKEN);
