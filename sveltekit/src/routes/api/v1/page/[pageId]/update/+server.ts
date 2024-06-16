import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ params: { pageId }, locals: { user, prisma }, request }) => {
	const schema = z.object({
		name: z.string().optional()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	await prisma.tilePage.update({
		where: {
			id: pageId,
			userId: user.id
		},
		data: body
	});

	return json({ success: true });
};
