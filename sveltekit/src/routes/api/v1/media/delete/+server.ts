import { z } from 'zod';
import { R2_BUCKET } from '$env/static/private';
import s3 from '$ts/server/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { user, prisma } }) => {
	const schema = z.object({
		url: z.string().min(1)
	});

	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	// Get the media from the database
	const media = await prisma.userMedia.findFirst({
		where: {
			url: body.url,
			userId: user.id
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
	await prisma.userMedia.delete({
		where: {
			id: media.id
		}
	});

	// Return success message
	return json({ message: 'Media successfully deleted.', success: true });
};
