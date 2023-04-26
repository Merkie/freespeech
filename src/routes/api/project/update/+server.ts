import prisma from '$ts/server/prisma';
import ProjectUpdateSchema from '$ts/schema/ProjectUpdateSchema';
import { z } from 'zod';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to edit a project.' }), {
			status: 401,
			headers: {
				'Content-Type': 'application/json'
			}
		});

	// Validate the request body
	let body;
	try {
		body = ProjectUpdateSchema.parse(await request.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(JSON.stringify({ error: 'An error occured when validating form.' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		return new Response(JSON.stringify({ error: 'An unknown error occured.' }), { status: 500 });
	}

	// Get the project
	const project = await prisma.project.findUnique({
		where: {
			id: body.id
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

	console.log(body.data);

	// Check if the user is the owner of the project
	if (project.userId !== locals.user.id)
		return new Response(JSON.stringify({ error: 'You are not the owner of this project.' }), {
			status: 403,
			headers: {
				'Content-Type': 'application/json'
			}
		});

	const requestedPage = await prisma.tilePage.findFirst({
		where: {
			name: body.pageName,
			projectId: body.id,
			userId: locals.user.id
		}
	});

	if (!requestedPage)
		return new Response(
			JSON.stringify({ error: 'The page you are trying to edit does not exist.' }),
			{
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

	await prisma.tilePage.update({
		where: {
			id: requestedPage.id
		},
		data: {
			data: body.data
		}
	});

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
