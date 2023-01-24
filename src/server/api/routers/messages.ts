import fs from "fs/promises";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const messagesRouter = createTRPCRouter({
	get: publicProcedure.query(async () => {
		const file = await fs.readFile("data.txt", "utf-8");
		const messages = file
			.split("\n")
			.map(line => {
				try {
					return JSON.parse(line) as Message;
				} catch {
					return null;
				}
			})
			.filter((message): message is Message => message !== null);
		return messages;
	}),
});
