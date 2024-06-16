import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import s3 from '$ts/server/s3';
import { R2_BUCKET } from '$env/static/private';
import slugify from '$ts/common/slugify';

async function createPresignedUrl(s3: S3Client, bucket: string, key: string): Promise<string> {
	const command = new PutObjectCommand({ Bucket: bucket, Key: key });
	return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export const POST = async ({ request, locals: { user } }) => {
	const schema = z.object({
		filename: z.string() // someimage.png
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body).success) return json({ error: 'Invalid request' });

	const ext = body.filename.split('.').at(-1);
	const key = `${slugify(user.name)}-${user.id}/${Date.now()}-${slugify(
		body.filename.split('.').slice(0, -1).join('').substring(0, 50)
	)}.${slugify(ext + '')}`;

	const presignedUrl = await createPresignedUrl(s3, R2_BUCKET, key);

	return json({ presignedUrl, key });
};
