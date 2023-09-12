import { json } from '@sveltejs/kit';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to create a page.' }), {
			status: 401
		});

	const ProjectCreationSchema = z.object({
		name: z.string(),
		columns: z.number(),
		rows: z.number()
	});

	// Validate the request body
	let body;
	try {
		body = ProjectCreationSchema.parse(await request.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(JSON.stringify({ error: 'An error occured when validating form.' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		return new Response(JSON.stringify({ error: 'An unknown error occured.' }), {
			status: 500
		});
	}

	// Create the project
	const project = await locals.prisma.project.create({
		data: {
			name: body.name,
			description: '',
			isPublic: false,
			columns: body.columns,
			rows: body.rows,
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