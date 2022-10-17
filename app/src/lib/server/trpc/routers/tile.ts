// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { Tile, User } from '@prisma/client';
import type { Context } from '../context';
import type { IMeta } from '../IMeta';

export default router<Context, IMeta>()
	.mutation('remove', {
		input: z.object({
			id: z.string()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

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

			// 4) Return the tile
			return tile;
		}
	})
	.mutation('edit', {
		input: z.object({
			id: z.string(),
			tile_index: z.number().optional(),
			tap_count: z.number().optional(),
			link_id: z.string().nullable().optional(),
			display_text: z.string().optional(),
			speak_text: z.string().nullable().optional(),
			image: z.string().nullable().optional(),
			navigation_page_id: z.number().nullable().optional(),
			modifier: z.string().nullable().optional(),
			background_color: z.string().nullable().optional(),
			border_color: z.string().nullable().optional(),
			text_color: z.string().nullable().optional(),
			is_silent: z.boolean().optional(),
			is_invisible: z.boolean().optional(),
			is_accented: z.boolean().optional()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

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
					...tile, // Adding the original tile data to the update
					...input // Adding the new data to the update in case its missing old data
				} as Tile
			});

			// 4) Return the tile
			return tile;
		}
	})
	.mutation('edit_many', {
		input: z.array(
			z.object({
				id: z.string(),
				tile_index: z.number().optional(),
				tap_count: z.number().optional(),
				link_id: z.string().nullable().optional(),
				display_text: z.string().optional(),
				speak_text: z.string().nullable().optional(),
				image: z.string().nullable().optional(),
				navigation_page_id: z.number().nullable().optional(),
				modifier: z.string().nullable().optional(),
				background_color: z.string().nullable().optional(),
				border_color: z.string().nullable().optional(),
				text_color: z.string().nullable().optional(),
				is_silent: z.boolean().optional(),
				is_invisible: z.boolean().optional(),
				is_accented: z.boolean().optional()
			})
		),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

			// 1) Get the tiles
			const tiles = await prismaClient.tile.findMany({
				where: {
					id: {
						in: input.map((tile) => tile.id)
					}
				}
			});
			if (!tiles) return null;

			// 2) Check if the user can edit the tiles
			if (tiles.some((tile: Tile) => tile.userId !== user.id)) return null;

			// itterate over each tile and update it
			for (const tile of tiles) {
				await prismaClient.tile.update({
					where: {
						id: tile.id
					},
					data: {
						tile_index: input.find((t) => t.id === tile.id)?.tile_index
					}
				});
			}

			return tiles;
		}
	})
	.query('fetch', {
		input: z.object({
			id: z.string()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

			// 1) Get the tile
			const tile = await prismaClient.tile.findUnique({
				where: {
					id: input.id
				}
			});
			if (!tile) return null;

			// 2) Check if the user can fetch the tile
			// if (tile.userId !== user.id) return null;

			// 3) Return the tile
			return tile;
		}
	})
	.query('fetch_many', {
		input: z.array(z.string()),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

			// 1) Get the tiles
			const tiles = await prismaClient.tile.findMany({
				where: {
					id: {
						in: input
					}
				}
			});
			if (!tiles) return null;

			// 2) Check if the user can fetch the tiles
			// if (tiles.some((tile: Tile) => tile.userId !== user.id)) return null;

			// 3) Return the tiles
			return tiles;
		}
	});
