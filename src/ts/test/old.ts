// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { json } from '@sveltejs/kit';
// import { z } from 'zod';

// const tileSchema = z.object({
// 	x: z.number(),
// 	y: z.number(),
// 	page: z.number(),
// 	text: z.string(),
// 	color: z.string(),
// 	image: z.string(),
// 	navigation: z.string(),
// 	displayText: z.string()
// });

// export const GET = async ({ locals: { prisma } }) => {
// 	const allTilePages = (await prisma.tilePage.findMany({})) as any[];

// 	const tilesToBeCreated: any[] = [];

// 	allTilePages.map((page) => {
// 		if (!page.data || !page.data.tiles) return console.log(`No tiles for page ${page.id}`);

// 		page.data.tiles.map((tile: any) => {
// 			const formattedTile = {
// 				page: 0,
// 				text: '',
// 				color: 'white',
// 				image: '',
// 				navigation: '',
// 				displayText: '',
// 				...tile
// 			};
// 			const parsedTile = tileSchema.safeParse(formattedTile);
// 			if (!parsedTile.success) {
// 				console.log('ERROR:');
// 				console.log(formattedTile);
// 			} else {
// 				tilesToBeCreated.push({
// 					tilePageId: page.id,
// 					x: formattedTile.x,
// 					y: formattedTile.y,
// 					page: formattedTile.page,
// 					text: formattedTile.text,
// 					color: formattedTile.color,
// 					image: formattedTile.image,
// 					navigation: formattedTile.navigation,
// 					displayText: formattedTile.displayText
// 				});
// 			}
// 		});
// 	});

// 	tilesToBeCreated.map((tile) => {
// 		const parsedTile = tileSchema.safeParse(tile);
// 		if (!parsedTile.success) {
// 			console.log('ERROR:');
// 			console.log(tile);
// 		}
// 	});

// 	tilesToBeCreated.reduce((acc, tile) => {
// 		if (!acc[tile.tilePageId]) acc[tile.tilePageId] = [];
// 		// check if tile already exists in spot
// 		const tileExists = acc[tile.tilePageId].find(
// 			(t: any) => t.x === tile.x && t.y === tile.y && t.page === tile.page
// 		);
// 		if (tileExists) {
// 			console.log(
// 				`Tile already exists at ${tile.x}, ${tile.y} on page ${tile.page} for tilePageId ${tile.tilePageId}`
// 			);
// 		}
// 		acc[tile.tilePageId].push(tile);
// 		return acc;
// 	}, {});

// 	console.log(`To be created length: ${tilesToBeCreated.length}`);
// 	console.log(`Current tiles length: ${allTilePages.map((page) => page.data.tiles).flat().length}`);

// 	await prisma.tile.createMany({
// 		data: tilesToBeCreated
// 	});

// 	return json({ message: 'Hello, world!' });
// };
