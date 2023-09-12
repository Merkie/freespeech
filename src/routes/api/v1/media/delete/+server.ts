import { z } from 'zod';
import { R2_BUCKET } from '$env/static/private';
import { MediaDeleteSchema } from '$ts/common/schema';
import s3 from '$ts/server/s3';

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

	// Delete the media from R2 storage
	const deleteResponse = await s3
		.deleteObject({
			Bucket: R2_BUCKET,
			Key: key
		})
		.promise();

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
