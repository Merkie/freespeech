import { router } from '@trpc/server';
import { z } from 'zod';
import prismaClient from '$lib/server/prismaClient';
import type { Tile, User } from '@prisma/client';

export default router()
	.mutation('add_tile', {
		input: z.object({
			page_id: z.number(),
			index: z.number()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx as User;
			if (!user) return null;

			// 1) Get the page
			const page = await prismaClient.tilePage.findUnique({
				where: {
					id: input.page_id
				},
				include: {
					tiles: true
				}
			});
			if (!page) return null;

			// 2) Check if the user can edit the page
			if (page.user_id !== user.id) return null;

			// 3) Create the tile
			const tile: Tile = await prismaClient.tile.create({
				data: {
					display_text: 'New tile',
					tile_index: input.index,
					parent_page: {
						connect: {
							id: page.id
						}
					},
					author: {
						connect: {
							id: user.id
						}
					}
				}
			});

			// 4) Add the tile to the page
			await prismaClient.tilePage.update({
				where: {
					id: page.id
				},
				data: {
					tiles: {
						connect: {
							id: tile.id
						}
					}
				}
			});

			return tile;
		}
	})
	.mutation('create', {
		input: z.string(),
		resolve: async ({ ctx, input }) => {
			const user = ctx as User;
			if (!user) return null;

			const project = await prismaClient.project.findFirst({
				where: {
					id: input,
					userId: user.id
				}
			});
			if (!project) return null;

			const updated = await prismaClient.project.update({
				where: {
					id: input
				},
				data: {
					pages: {
						create: {
							name: 'My new page',
							user: {
								connect: {
									id: user.id
								}
							}
						}
					}
				},
				include: {
					pages: true
				}
			});

			return updated.pages.at(-1)?.id;
		}
	});
