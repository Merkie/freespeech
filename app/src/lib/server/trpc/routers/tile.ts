import { router } from '@trpc/server';
import { z } from 'zod';
import prismaClient from '$lib/server/prismaClient';
import type { Tile, User } from '@prisma/client';

export default router()
	.mutation('remove', {
		input: z.object({
			id: z.string()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx as User;
			if (!user) return null;

			// 1) Get the tile
			const tile = await prismaClient.tile.findUnique({
				where: {
					id: input.id
				}
			});
			if (!tile) return null;

			// 2) Check if the user can remove the tile
			if (tile.userId !== user.id) return null;

			// 3) Remove the tile
			await prismaClient.tile.delete({
				where: {
					id: input.id
				}
			});

			return tile;
		}
	})
	.mutation('edit', {
		input: z.object({
			id: z.string(),
			display_text: z.string(),
			is_invisible: z.boolean(),
			is_accented: z.boolean(),
			navigation_page_id: z.number().optional()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx as User;
			if (!user) return null;

			// 1) Get the tile
			const tile = await prismaClient.tile.findUnique({
				where: {
					id: input.id
				}
			});
			if (!tile) return null;

			// 2) Check if the user can edit the tile
			if (tile.userId !== user.id) return null;

			// 3) Edit the tile
			await prismaClient.tile.update({
				where: {
					id: input.id
				},
				data: {
					...tile,
					...input
				}
			});

			return tile;
		}
	})
	.mutation('reorder', {
		input: z.object({
			indexes: z.array(z.number()),
			page_id: z.number()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx as User;
			if (!user) return null;

			// 1) Get the tiles
			const tiles = await prismaClient.tile.findMany({
				where: {
					tilePageId: input.page_id
				}
			});
			if (!tiles) return null;

			// 2) Check if the user can edit the tile
			if (tiles[0].userId !== user.id) return null;

			// 3) Edit the tile
			tiles.forEach(async (tile, index) => {
				try {
					await prismaClient.tile.update({
						where: {
							id: tile.id
						},
						data: {
							tile_index: input.indexes[index]
						}
					});
				} catch (e) {}
			});

			return tiles;
		}
	});
