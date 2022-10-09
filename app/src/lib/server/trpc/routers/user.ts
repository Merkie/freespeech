// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { User } from '@prisma/client';

export default router()
	.query('me', {
		resolve: async ({ ctx }) => ctx
	})
	.query('validate_email', {
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
	.query('me_whole', {
		resolve: async ({ ctx }) => {
			const user = await prismaClient.user.findUnique({
				where: {
					id: (ctx as User).id
				},
				include: {
					projects: {
						include: {
							pages: {
								include: {
									tiles: true
								}
							}
						}
					}
				}
			});

			return user;
		}
	});
