import prisma from '$ts/server/prisma';
import ProjectCreationSchema from '$ts/schema/ProjectCreationSchema';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to create a project.' }), {
			status: 401
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
	const project = await prisma.project.create({
		data: {
			name: body.name,
			description: body.description || '',
			isPublic: body.isPublic || false,
			user: {
				connect: {
					id: locals.user.id
				}
			}
		}
	});

	// Create the home page
	await prisma.tilePage.create({
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
						text: 'New tile',
						x: 0,
						y: 0
					}
				]
			}
		}
	});

	// Get the entire project
	const fullProject = await prisma.project.findUnique({
		where: {
			id: project.id
		},
		include: {
			pages: true
		}
	});

	return new Response(JSON.stringify({ project: fullProject }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
