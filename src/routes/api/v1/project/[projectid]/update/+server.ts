import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ params: { projectid }, request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			pageName: z.string().min(3).max(50),
			data: z.any()
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Get the project
	const project = await locals.prisma.project.findUnique({
		where: {
			id: projectid
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the user is the owner of the project
	if (project.userId !== locals.user.id)
		return json({
			error: 'You are not the owner of this project.'
		});

	const requestedPage = await locals.prisma.tilePage.findFirst({
		where: {
			name: form.data.pageName,
			projectId: projectid,
			userId: locals.user.id
		}
	});

	if (!requestedPage) return json({ error: 'The page you are trying to edit does not exist.' });

	await locals.prisma.tilePage.update({
		where: {
			id: requestedPage.id
		},
		data: {
			data: form.data.data
		}
	});

	return json({ success: true });
};
