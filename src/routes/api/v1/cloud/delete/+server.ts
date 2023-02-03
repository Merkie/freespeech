import validateRequest from '$lib/helpers/validateRequest';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import s3 from '$lib/resources/aws-s3';
import { AWS_S3_BUCKET } from '$env/static/private';

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

	const key = location.split('amazonaws.com/')[1];

	const params = {
		Bucket: AWS_S3_BUCKET,
		Key: key
	};

	const result = await s3.deleteObject(params).promise();

	return {
		status: 200,
		body: {
			location: result,
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
