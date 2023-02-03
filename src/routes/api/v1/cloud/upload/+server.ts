import validateRequest from '$lib/helpers/validateRequest';
import { AWS_S3_BUCKET } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import s3 from '$lib/resources/aws-s3';

const uploadToS3 = async ({ data, userid }: { data: string; userid: string }) => {
	const schema = z.object({
		data: z.string(),
		userid: z.string()
	});

	if (!schema.safeParse({ data, userid }).success) {
		return {
			status: 400,
			body: {
				success: false,
				message: 'There was an issue with the request data.'
			}
		};
	}

	// infer file type from beginning of base64 string

	const filetype = data.match(/data:image\/(.*);base64/)?.[1];

	const params = {
		Bucket: AWS_S3_BUCKET,
		Key: `${userid}/${Date.now()}.${filetype}`,
		Body: Buffer.from(data.split(',')[1], 'base64')
	};

	const result = await s3.upload(params).promise();

	return {
		status: 200,
		body: {
			location: result.Location || null,
			success: result.Location ? true : false
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
	const result = await uploadToS3({
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
