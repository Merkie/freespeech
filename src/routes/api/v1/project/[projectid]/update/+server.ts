import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import slugify from '$ts/common/slugify';

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

	// Get all user projects
	const projects = await prisma.project.findMany({
		where: {
			userId: user.id
		}
	});

	// Get the project
	const project = projects.find((project) => project.id === projectid);

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the project name is already taken
	if (form.data.name)
		if (
			projects
				.filter((project) => project.id !== projectid)
				.map((project) => slugify(project.name))
				.includes(slugify(form.data.name))
		)
			return json({
				error: 'A project with that name already exists.'
			});

	// Update the project
	await prisma.project.update({
		where: {
			id: projectid
		},
		data: {
			name: form.data.name || project.name,
			columns: form.data.columns || project.columns,
			rows: form.data.rows || project.rows
		}
	});

	return json({ success: true });
};
