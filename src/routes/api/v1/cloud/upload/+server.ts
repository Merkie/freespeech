import validateRequest from '$lib/helpers/validateRequest';
import { R2_HOST, R2_BUCKET } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import r2 from '$lib/resources/cf-r2';

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

	const filetype = data.match(/data:image\/(.*);base64/)?.[1];

	const params = {
		bucket: R2_BUCKET,
		key: `${userid}/${Date.now()}.${filetype}`,
		body: Buffer.from(data.split(',')[1], 'base64')
	};

	// Upload the file to R2
	const result = await r2.putObject(params);

	// If the upload failed send an empty location
	if (result.status !== 200) {
		return {
			status: 500,
			body: {
				success: false,
				location: ''
			}
		};
	}

	return {
		status: 200,
		body: {
			location: `${R2_HOST}/${params.key}`,
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
