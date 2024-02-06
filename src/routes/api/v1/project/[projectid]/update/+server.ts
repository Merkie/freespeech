import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ params: { projectId }, locals: { prisma, user }, request, url }) => {
	const schema = z.object({
		name: z.string().min(1).max(255).optional(),
		columns: z.number().min(1).max(10).optional(),
		rows: z.number().min(1).max(10).optional(),
		imageUrl: z.string().url().optional()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Update the project
	await prisma.project.update({
		where: {
			id: projectId || url.pathname.split('project/')[1].split('/delete')[0],
			userId: user.id
		},
		data: body
	});

	return json({ success: true });
};
