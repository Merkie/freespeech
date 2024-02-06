import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ locals: { prisma, user }, request }) => {
	const schema = z.object({
		x: z.number(),
		y: z.number(),
		page: z.number(),
		pageId: z.string()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get the page
	const page = await prisma.tilePage.findUnique({
		where: {
			id: body.pageId,
			userId: user.id
		},
		include: {
			tiles: true
		}
	});

	// Check if the page exists
	if (!page) return json({ error: 'The page does not exist.' });

	// Check if there is a tile in the same location
	if (page.tiles.find((tile) => tile.x === body.x && tile.y === body.y && tile.page === body.page))
		return json({ error: 'A tile already exists in this location.' });

	// Create the tile
	const tile = await prisma.tile.create({
		data: {
			x: body.x,
			y: body.y,
			page: body.page,
			tilePageId: body.pageId
		}
	});

	return json({ tile });
};
