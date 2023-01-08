import validateRequest from '$lib/helpers/validateRequest';
import prisma from '$lib/resources/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const getProject = async ({ id, userId }: { id: string; userId: string }) => {
	const schema = z.object({
		id: z.string(),
		userId: z.string()
	});

	if (!schema.safeParse({ id, userId }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	const project = await prisma.project.findUnique({
		where: {
			id
		},
		include: {
			pages: {
				include: {
					tiles: true
				}
			}
		}
	});

	if (!project) {
		return {
			status: 404,
			body: {
				success: false,
				message: 'Project not found.'
			}
		};
	}

	if (project.userId !== userId && !project.isPublic) {
		return {
			status: 403,
			body: {
				success: false,
				message: 'You do not have permission to view this project.'
			}
		};
	}

	return {
		body: {
			project,
			success: true
		},
		status: 200
	};
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await validateRequest(request);
	if (!user) {
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400
		});
	}
	const json = await request.json();
	const result = await getProject({ ...json, userId: user.id });
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
