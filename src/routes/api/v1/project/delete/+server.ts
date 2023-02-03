import validateRequest from '$lib/helpers/validateRequest';
import mongo from '$lib/resources/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const deleteProject = async ({ id, userid }: { id: string; userid: string }) => {
	const schema = z.object({
		id: z.string(),
		userid: z.string()
	});

	if (!schema.safeParse({ id, userid }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const project = await mongo.collection('projects').findOne({ _id: id });

	if (!project) {
		return {
			status: 404,
			body: {
				success: false,
				message: 'Project not found.'
			}
		};
	}

	if (project.userid !== userid && project.private === true) {
		return {
			status: 403,
			body: {
				success: false,
				message: 'You do not have permission to view this project.'
			}
		};
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	await mongo.collection('projects').deleteOne({ _id: id });

	return {
		body: {
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
	const result = await deleteProject({
		...json,
		userid: (user as unknown as { _id: string })._id
	});
	return new Response(JSON.stringify(result.body), {
		status: result.status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
