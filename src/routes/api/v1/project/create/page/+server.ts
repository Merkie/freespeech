import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(1).max(50),
			projectid: z.string().min(1)
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Get the project
	const project = await locals.prisma.project.findUnique({
		where: {
			id: form.data.projectid
		}
	});

	// Check if the project exists
	if (!project) return json({ error: 'The project you are trying to edit does not exist.' });

	// Check if the user is the owner of the project
	if (project.userId !== locals.user.id)
		return json({
			error: 'You are not the owner of this project.'
		});

	// Check if the page already exists
	if (
		await locals.prisma.tilePage.findFirst({
			where: {
				name: form.data.name,
				projectId: form.data.projectid
			}
		})
	)
		return json({
			error: 'A page with that name already exists in the project.'
		});

	// Create the page
	const page = await locals.prisma.tilePage.create({
		data: {
			name: form.data.name,
			Project: {
				connect: {
					id: form.data.projectid
				}
			},
			user: {
				connect: {
					id: locals.user.id
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
