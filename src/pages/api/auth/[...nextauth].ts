import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import SlackProvider from "next-auth/providers/slack";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

const adapter = PrismaAdapter(prisma);
// @ts-expect-error - PrismaAdapter is missing the linkAccount method
adapter.linkAccount = ({ provider, type, providerAccountId, access_token, token_type, id_token, userId }) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	return prisma.account.create({
		data: {
			provider,
			type,
			providerAccountId,
			access_token,
			token_type,
			id_token,
			userId,
		},
	});
};

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	// Configure one or more authentication providers
	adapter,
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		SlackProvider({
			clientId: env.SLACK_CLIENT_ID,
			clientSecret: env.SLACK_CLIENT_SECRET,
		}),
	],
	secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
