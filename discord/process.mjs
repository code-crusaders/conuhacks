import { Client, GatewayIntentBits } from "discord.js";
import { env } from "../env/server.mjs";

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.on("ready", () => {
	console.log("I am ready!");
});

const discordData = {
	type: "test",
	channel: "test",
	author: "test",
	role: "test",
	messageContent: "test",
	eventInfo: "test",
};

client.on("messageCreate", message => {
	if (message.author.bot) return;

	if (!message.guildId) return;
	const guild = client.guilds.cache.get(message.guildId);
	const roles = guild?.roles.cache.filter(r => r.members.has(message.author.id)).map(r => r.name);
	const channel = guild?.channels.cache.filter(c => c.id === message.channelId).map(c => c.name);
	console.log(roles, channel);

	console.log(guild, roles);
});

/* client.on("guildScheduledEventCreate", event => {
	// discordData.type = "event";
	// discordData.role = "NA";
	// discordData.messageContent = "NA";
	// discordData.eventInfo = event.name;
	// discordData.author = event.creator;
	// discordData.channel = event.channel.name;
}); */

client.login(env.DISCORD_TOKEN);
