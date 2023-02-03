import validateRequest from '$lib/helpers/validateRequest';
import mongo from '$lib/resources/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const updateProject = async ({ project, userid }: { project: any; userid: string }) => {
	const schema = z.object({
		userid: z.string(),
		project: z.any()
	});

	if (!schema.safeParse({ project, userid }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	const oldProject = await mongo.collection('projects').findOne({ _id: project._id });

	if (!oldProject) {
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

	// replace the project with the new one
	await mongo
		.collection('projects')
		.replaceOne({ _id: oldProject._id }, { ...oldProject, ...project });

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
	const result = await updateProject({
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
