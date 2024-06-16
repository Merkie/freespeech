import { z } from 'zod';
import { R2_BUCKET } from '$env/static/private';
import slugify from '$ts/common/slugify';
import s3 from '$ts/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { prisma, user } }) => {
	const schema = z.object({
		filename: z.string().min(1),
		base64data: z.string().min(1)
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	const ext = body.filename.split('.').at(-1);

	// Create the media path
	const key = `${slugify(user.name)}-${user.id}/${Date.now()}-${slugify(
		body.filename.split('.').slice(0, -1).join('').substring(0, 50)
	)}.${slugify(ext + '')}`;

	const putObjectCommand = new PutObjectCommand({
		Bucket: R2_BUCKET,
		Key: key,
		Body: Buffer.from(body.base64data, 'base64')
	});

	const putObjectResponse = await s3.send(putObjectCommand);

	if (putObjectResponse.$metadata.httpStatusCode !== 200)
		return json({
			error: 'An error occured when uploading the media to storage.'
		});

	// Check if the upload was successful
	const fileurl = `/${key}`;

	// Add the media to the database
	await prisma.userMedia.create({
		data: {
			url: fileurl,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	// Return the file URL
	return json({ fileurl });
};
