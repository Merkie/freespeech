import prismaClient from '$lib/server/prismaClient';
import { router } from '@trpc/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Types
import type { Project, Tile, TilePage, User } from '@prisma/client';

export default router()
	.mutation('create', {
		input: z.object({
			name: z.string(),
			description: z.string(),
			index: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			// 1) Check if user is logged in
			const user = ctx as User;
			if (!user.identifier_token) return null;

			// 2) Create project
			const project = await prismaClient.project.create({
				data: {
					name: input.name,
					description: input.description,
					author: {
						connect: {
							id: user.id
						}
					},
					index: input.index,
					pages: {
						create: {
							name: 'Home',
							user: {
								connect: {
									id: user.id
								}
							},
							tiles: {
								create: {
									tile_index: 0,
									display_text: 'First tile!',
									author: {
										connect: {
											id: user.id
										}
									}
								}
							}
						}
					}
				}
			});

			// 3) Return project
			return project;
		}
	})
	.query('fetch', {
		input: z.string(),
		resolve: async ({ input, ctx }) => {
			// 1) Get user from context
			const user = ctx as User;

			// 2) Get project
			const project = await prismaClient.project.findUnique({
				where: {
					id: input
				},
				include: {
					pages: {
						include: {
							tiles: true
						}
					}
				}
			});
			if (!project) return null;

			// 3) Check if user is authorized to view project
			// Checking to see if the user is the author of the project
			// or if the project is public.
			if (project.userId !== user.id || project.public) return project;
			return null;
		}
	});
