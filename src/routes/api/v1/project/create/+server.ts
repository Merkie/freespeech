import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string(),
			columns: z.number(),
			rows: z.number()
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Create the project
	const project = await locals.prisma.project.create({
		data: {
			name: form.data.name,
			description: '',
			isPublic: false,
			columns: form.data.columns,
			rows: form.data.rows,
			user: {
				connect: {
					id: locals.user.id
				}
			}
		}
	});

	// Create the home page
	await locals.prisma.tilePage.create({
		data: {
			name: 'Home',
			Project: {
				connect: {
					id: project.id
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
						x: 0,
						y: 0
					}
				]
			}
		}
	});

	return json({
		success: true
	});
};
