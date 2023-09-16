import slugify from '$ts/common/slugify';
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
		},
		include: {
			pages: true
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the page exists
	if (form.data.name)
		if (
			project.pages
				.filter((page) => page.id !== pageid)
				.map((page) => slugify(page.name))
				.includes(slugify(form.data.name))
		)
			return json({
				error: 'A page with that name already exists in the project.'
			});

	const requestedPage = project.pages.find((page) => page.id === pageid);

	if (!requestedPage) return json({ error: 'The page you are trying to edit does not exist.' });

	await prisma.tilePage.update({
		where: {
			id: requestedPage.id
		},
		data: {
			data: form.data.data || requestedPage.data,
			name: form.data.name || requestedPage.name
		}
	});

	return json({ success: true });
};
