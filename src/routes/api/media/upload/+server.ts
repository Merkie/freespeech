import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import prisma from '$ts/server/prisma';
import MediaUploadSchema from '$ts/schema/MediaUploadSchema';
import { z } from 'zod';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET, AWS_REGION } from '$env/static/private';
import stringGate from '$ts/common/stringGate';

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
	const mediapath = `${stringGate(locals.user.name)}-${locals.user.id}/${Date.now()}-${stringGate(
		body.filename
	)}`;

	// Create the S3 upload command
	const command = new PutObjectCommand({
		Bucket: S3_BUCKET,
		Key: mediapath,
		Body: Buffer.from(body.base64data, 'base64')
	});

	// Upload the media to S3
	const s3Client = new S3Client({});
	const s3response = await s3Client.send(command);

	// Check if the upload was successful
	if (s3response.$metadata.httpStatusCode !== 200) {
		return new Response(JSON.stringify({ error: 'An error occured when uploading media.' }), {
			status: 500
		});
	}

	// Create the file URL
	const fileurl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${mediapath}`;

	// Log the media in the DB
	await prisma.userMedia.create({
		data: {
			user: {
				connect: {
					id: locals.user.id
				}
			},
			url: fileurl
		}
	});

	// Return the file URL
	return new Response(JSON.stringify({ fileurl }), {
		status: 200
	});
};
