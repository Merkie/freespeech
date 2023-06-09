import { MediaUploadSchema } from '$ts/common/schema';
import { z } from 'zod';
import { R2_ACCESS_KEY, R2_SECRET_KEY, R2_ACCOUNT_ID, R2_BUCKET } from '$env/static/private';
import stringGate from '$ts/common/stringGate';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import R2 from 'cloudflare-r2';

export const POST = async ({ request, locals, fetch }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to upload media.' }), {
			status: 401
		});

	// Validate the request body
	let body;
	try {
		body = MediaUploadSchema.parse(await request.json());
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(JSON.stringify({ error: 'An error occured when validating form.' }), {
				status: 400
			});
		}
		return new Response(JSON.stringify({ error: 'An unknown error occured.' }), {
			status: 500
		});
	}

	const response = await fetch('https://api.freespeechaac.com/v1/media/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			base64data: body.base64data,
			ext: body.filename.split('.').pop()
		})
	});

	const data = await response.json();

	if (!data.url) {
		return new Response(JSON.stringify({ error: 'An error occured when uploading the file.' }), {
			status: 500
		});
	}

	return new Response(JSON.stringify({ fileurl: `https://api.freespeechaac.com${data.url}` }), {
		status: 200
	});
};
