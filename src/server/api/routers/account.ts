import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getImage: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { id } = input;

			const user = await ctx.prisma.user.findUnique({
				where: {
					id,
				},
			});

			return user?.image;
		}),
});
