import slugify from '$ts/common/slugify';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ params: { projectid }, locals: { prisma, user }, request }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(1).max(50)
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

	// Check if the page already exists
	if (project.pages.map((page) => slugify(page.name)).includes(slugify(form.data.name)))
		return json({
			error: 'A page with that name already exists in the project.'
		});

	// Create the page
	const page = await prisma.tilePage.create({
		data: {
			name: form.data.name,
			Project: {
				connect: {
					id: projectid
				}
			},
			user: {
				connect: {
					id: user.id
				}
			},
			data: {
				tiles: [
					{
						page: 0,
						text: 'New tile',
						color: 'white',
						x: 0,
						y: 0
					}
				]
			}
		}
	});

	return json({ page });
};
