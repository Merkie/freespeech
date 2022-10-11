// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

// Types
import type { Tile, User } from '@prisma/client';

import aws from 'aws-sdk';
import dotenv from 'dotenv';
import type { Context } from '../context';
import type { IMeta } from '../IMeta';
dotenv.config();

const s3 = new aws.S3({
	accessKeyId: process.env.FS_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.FS_AWS_SECRET_ACCESS_KEY
});

export default router<Context, IMeta>()
	.mutation('upload', {
		input: z.object({
			file: z.string(),
			filename: z.string()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}

			const parsed = JSON.parse(input.file);

			try {
				const filename: string = Date.now().toString().substring(0, 5) + input.filename;

				const image = await s3
					.putObject({
						Body: Buffer.from(parsed.blob.split(',')[1], 'base64'),
						Bucket: process.env.AWS_BUCKET_NAME || '',
						Key: filename
					})
					.promise();

				// get the url of the image
				const url = `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${filename}`;

				await prismaClient.s3Resource.create({
					data: {
						url,
						author: {
							connect: {
								id: user.id
							}
						}
					}
				});

				return url;
			} catch (error) {}
			return null;
		}
	})
	.mutation('remove', {
		input: z.object({
			url: z.string()
		}),
		resolve: async ({ ctx, input }) => {
			const user = ctx.user;
			if (!user) {
				return null;
			}
			const filename = input.url.split('/').pop();

			s3.deleteObject(
				{
					Bucket: process.env.AWS_BUCKET_NAME || '',
					Key: filename + ''
				},
				() => {}
			);

			const resource = await prismaClient.s3Resource.findFirst({
				where: {
					url: input.url,
					userId: user.id
				}
			});
			if (!resource) return;

			await prismaClient.s3Resource.delete({
				where: {
					id: resource.id
				}
			});
			return true;
		}
	});
