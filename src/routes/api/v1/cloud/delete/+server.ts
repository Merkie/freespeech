import validateRequest from '$lib/ts/validateRequest';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { R2_BUCKET } from '$env/static/private';
import r2 from '$lib/resources/cf-r2';

const deleteFromS3 = async ({ location, userid }: { location: string; userid: string }) => {
	const schema = z.object({
		location: z.string(),
		userid: z.string()
	});

	if (!schema.safeParse({ location, userid }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	const params = {
		bucket: R2_BUCKET,
		key: location.split('.dev/')[1]
	};

	// Delete the file from R2
	const result = await r2.deleteObject(params);

	// If the deletion was not successful
	if (result.status !== 204) {
		return {
			status: 500,
			body: {
				success: false,
				message: 'There was an issue deleting the file.'
			}
		};
	}

	return {
		status: 200,
		body: {
			success: true
		}
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
	const result = await deleteFromS3({
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
