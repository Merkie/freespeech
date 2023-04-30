import { z } from 'zod';
import { R2_ACCESS_KEY, R2_SECRET_KEY, R2_ACCOUNT_ID, R2_BUCKET } from '$env/static/private';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import R2 from 'cloudflare-r2';
import MediaDeleteSchema from '$ts/schema/MediaDeleteSchema';

export const POST = async ({ request, locals }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(JSON.stringify({ error: 'You must be logged in to delete media.' }), {
			status: 401
		});

	// Validate the request body
	let body;
	try {
		body = MediaDeleteSchema.parse(await request.json());
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

	// Get the media from the database
	const media = await locals.prisma.userMedia.findFirst({
		where: {
			url: body.url,
			userId: locals.user.id
		}
	});

	// Check if the media exists
	if (!media)
		return new Response(
			JSON.stringify({ error: 'The media you are trying to delete does not exist.' }),
			{
				status: 404
			}
		);

	// Extract the key from the media URL
	const key = media.url.replace(/^https:\/\/pub-3aabe8e9655b4a5eb94c0efbaa7142a1\.r2\.dev\//, '');

	// Initialize the R2 client
	const r2 = new R2({
		accessKey: R2_ACCESS_KEY,
		secretKey: R2_SECRET_KEY,
		accountId: R2_ACCOUNT_ID,
		region: 'auto'
	});

	// Delete the media from R2 storage

	const deleteResponse = await r2.deleteObject({
		bucket: R2_BUCKET,
		key
	});

	// Check if the deletion was successful
	if (deleteResponse.status !== 204)
		return new Response(JSON.stringify({ error: 'An error occured when deleting the media.' }), {
			status: 500
		});

	// Delete the media from the database
	await locals.prisma.userMedia.delete({
		where: {
			id: media.id
		}
	});

	// Return success message
	return new Response(JSON.stringify({ message: 'Media successfully deleted.', success: true }), {
		status: 200
	});
};
