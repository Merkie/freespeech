import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({
	params: { projectid, pageid },
	locals: { user, prisma },
	request
}) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(3).max(50).optional(),
			data: z.any().optional()
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

	// Check if the user is the owner of the project
	if (project.userId !== user.id)
		return json({
			error: 'You are not the owner of this project.'
		});

	const requestedPage = await prisma.tilePage.findFirst({
		where: {
			id: pageid,
			projectId: projectid,
			userId: user.id
		}
	});

	if (!requestedPage) return json({ error: 'The page you are trying to edit does not exist.' });

	await prisma.tilePage.update({
		where: {
			id: requestedPage.id
		},
		data: {
			data: form.data.data ?? requestedPage.data,
			name: form.data.name ?? requestedPage.name
		}
	});

	return json({ success: true });
};
