import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ params: { tileId }, locals: { prisma, user }, request }) => {
	const schema = z.object({
		x: z.number().optional(),
		y: z.number().optional(),
		page: z.number().optional(),
		text: z.string().optional(),
		color: z.string().optional(),
		image: z.string().optional(),
		navigation: z.string().optional(),
		displayText: z.string().optional()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	await prisma.tile.update({
		where: {
			id: tileId,
			TilePage: {
				userId: user.id
			}
		},
		data: body
	});

	return json({ success: true });
};
