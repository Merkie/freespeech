import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			id: z.string().min(1),
			imageUrl: z.string().min(1)
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Get the project
	const project = await locals.prisma.project.findFirst({
		where: {
			id: form.data.id,
			userId: locals.user.id
		}
	});

	// Check if the project exists
	if (!project)
		return json({
			error: 'The project you are trying to edit does not exist.'
		});

	await locals.prisma.project.update({
		where: {
			id: form.data.id
		},
		data: {
			imageUrl: form.data.imageUrl
		}
	});

	return json({
		success: true
	});
};
