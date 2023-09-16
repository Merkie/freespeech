import { z } from 'zod';
import { R2_BUCKET, R2_PUBLIC_URL } from '$env/static/private';
import slugify from '$ts/common/slugify';
import s3 from '$ts/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { superValidate } from 'sveltekit-superforms/server';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			filename: z.string().min(1),
			base64data: z.string().min(1)
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Create the media path
	const key = `${slugify(locals.user.name)}-${locals.user.id}/${Date.now()}-${slugify(
		form.data.filename
	)}`;

	const putObjectCommand = new PutObjectCommand({
		Bucket: R2_BUCKET,
		Key: key,
		Body: Buffer.from(form.data.base64data, 'base64')
	});

	const putObjectResponse = await s3.send(putObjectCommand);

	if (putObjectResponse.$metadata.httpStatusCode !== 200)
		return json({
			error: 'An error occured when uploading the media to storage.'
		});

	// Check if the upload was successful
	const fileurl = `${R2_PUBLIC_URL}${key}`;

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
	return json({ fileurl });
};
