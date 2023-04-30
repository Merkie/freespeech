import MediaUploadSchema from '$ts/schema/MediaUploadSchema';
import { z } from 'zod';
import { R2_ACCESS_KEY, R2_SECRET_KEY, R2_ACCOUNT_ID, R2_BUCKET } from '$env/static/private';
import stringGate from '$ts/common/stringGate';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import R2 from 'cloudflare-r2';

export const POST = async ({ request, locals }) => {
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

	// Create the media path
	const key = `${stringGate(locals.user.name)}-${locals.user.id}/${Date.now()}-${stringGate(
		body.filename
	)}`;

	const r2 = new R2({
		accessKey: R2_ACCESS_KEY,
		secretKey: R2_SECRET_KEY,
		accountId: R2_ACCOUNT_ID,
		region: 'auto'
	});

	const putResponse = await r2.putObject({
		bucket: R2_BUCKET,
		key,
		body: Buffer.from(body.base64data, 'base64')
	});

	if (putResponse.status !== 200)
		return new Response(JSON.stringify({ error: 'An error occured when uploading the file.' }), {
			status: 500
		});

	// Check if the upload was successful
	const fileurl = `https://pub-3aabe8e9655b4a5eb94c0efbaa7142a1.r2.dev/${key}`;

	// Add the media to the database
	await locals.prisma.userMedia.create({
		data: {
			url: fileurl,
			user: {
				connect: {
					id: locals.user.id
				}
			}
		}
	});

	// Return the file URL
	return new Response(JSON.stringify({ fileurl }), {
		status: 200
	});
};
