import { z } from 'zod';
import { R2_BUCKET } from '$env/static/private';
import { MediaDeleteSchema } from '$ts/common/schema';
import s3 from '$ts/server/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const POST = async ({ request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			url: z.string()
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Get the media from the database
	const media = await locals.prisma.userMedia.findFirst({
		where: {
			url: form.data.url,
			userId: locals.user.id
		}
	});

	// Check if the media exists
	if (!media)
		return json({
			error: 'The media you are trying to delete does not exist.'
		});

	// Extract the key from the media URL
	const key = media.url.replace(/^https:\/\/pub-3aabe8e9655b4a5eb94c0efbaa7142a1\.r2\.dev\//, '');

	// Delete the media from R2 storage
	const deleteObjectCommand = new DeleteObjectCommand({
		Bucket: R2_BUCKET,
		Key: key
	});

	const deleteObjectResponse = await s3.send(deleteObjectCommand);

	// Check if the media was successfully deleted
	if (deleteObjectResponse.$metadata.httpStatusCode !== 204)
		return json({
			error: 'An error occured when deleting the media from storage.'
		});

	// Delete the media from the database
	await locals.prisma.userMedia.delete({
		where: {
			id: media.id
		}
	});

	// Return success message
	return json({ message: 'Media successfully deleted.', success: true });
};
