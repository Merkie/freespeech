// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { User } from '@prisma/client';
import type { IMeta } from '../IMeta';
import type { Context } from '../context';

export default router<Context, IMeta>()
	.query('validate_email', {
		meta: {
			doesNotNeedAuthentication: true
		},
		input: z.string(),
		resolve: async ({ input }) => {
			// 1) Check if the email is already in use
			const user = await prismaClient.user.findFirst({
				where: {
					email: input
				}
			});

			// 2) Return true if the email is already in use
			return !!user;
		}
	})
	.query('me', {
		resolve: async ({ ctx }) => ctx
	})
	.query('me_whole', {
		resolve: async ({ ctx }) => {
			const user = ctx.user;
			if (!user) {
				return {};
			}
			return await prismaClient.user.findUnique({
				where: {
					id: user.id
				},
				select: {
					hashed_password: false,
					id: true,
					identifier_token: true,
					email: true,
					username: true,
					image: true,
					theme: true,
					projects: true,
					access_tokens: true,
					tiles: true,
					tile_pages: true,
					s3_resources: true
				}
			});
		}
	});
