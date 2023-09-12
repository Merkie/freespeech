import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ params: { projectid }, locals: { prisma, user }, request }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(1).max(255).optional(),
			columns: z.number().min(1).max(10).optional(),
			rows: z.number().min(1).max(10).optional()
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Get the project
	const project = await prisma.project.findUnique({
		where: {
			id: projectid,
			userId: user.id
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Update the project
	await prisma.project.update({
		where: {
			id: projectid
		},
		data: {
			name: form.data.name ?? project.name,
			columns: form.data.columns ?? project.columns,
			rows: form.data.rows ?? project.rows
		}
	});

	return json({ success: true });
};
