import prisma from '$ts/server/prisma';
import PageCreationSchema from '$ts/schema/PageCreationSchema';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to create a page.' }), {
			status: 401
		});

	// Validate the request body
	let body;
	try {
		body = PageCreationSchema.parse(await request.json());
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

	// Get the project
	const project = await prisma.project.findUnique({
		where: {
			id: body.projectid
		}
	});

	// Check if the project exists
	if (!project)
		return new Response(
			JSON.stringify({ error: 'The project you are trying to edit does not exist.' }),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	// Check if the user is the owner of the project
	if (project.userId !== locals.user.id)
		return new Response(JSON.stringify({ error: 'You are not the owner of this project.' }), {
			status: 403
		});

	// Check if the page already exists
	if (
		await prisma.tilePage.findFirst({
			where: {
				name: body.name,
				projectId: body.projectid
			}
		})
	)
		return new Response(
			JSON.stringify({ error: 'A page with that name already exists in the project.' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	// Create the page
	const page = await prisma.tilePage.create({
		data: {
			name: body.name,
			Project: {
				connect: {
					id: body.projectid
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

	// get the full project
	// const fullProject = await prisma.project.findUnique({
	// 	where: {
	// 		id: body.projectid
	// 	},
	// 	include: {
	// 		pages: true
	// 	}
	// });

	return new Response(JSON.stringify({ page }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
