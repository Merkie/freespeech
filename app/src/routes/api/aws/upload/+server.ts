import type { RequestHandler } from '@sveltejs/kit';
import { s3 } from '$lib/aws';

export const POST: RequestHandler = async ({ request }) => {
	const body: { content: string; filename: string } = await request.json();
	const parsed = JSON.parse(body.content);

	try {
		// TODO: Perhaps a better name for these files other than a timestamp?
		// Put the image to AWS S3
		const image = await s3
			.putObject({
				Body: Buffer.from(parsed.blob.split(',')[1], 'base64'),
				Bucket: process.env.AWS_BUCKET_NAME || '',
				Key: body.filename
			})
			.promise();

		// get the url of the image
		const url = `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${body.filename}`;
		return new Response(JSON.stringify({ message: 'ok', url }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'error', error }), { status: 200 });
	}
};
