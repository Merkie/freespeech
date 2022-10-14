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

const polly = new aws.Polly({
	signatureVersion: 'v4',
	region: 'us-east-1',
	accessKeyId: process.env.FS_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.FS_AWS_SECRET_ACCESS_KEY
});

export default router<Context, IMeta>().mutation('synthesise', {
	input: z.object({
		text: z.string()
	}),
	resolve: async ({ input }) => {
		let params = {
			Engine: 'neural',
			Text: input.text,
			OutputFormat: 'mp3', // this can also be 'json' or 'pcm'
			VoiceId: 'Kimberly'
		};

		const audio = await polly.synthesizeSpeech(params).promise();
		if (!audio.AudioStream) return null;

		const filename = Date.now().toString() + '-speech.mp3';

		const audio_file = await s3
			.putObject({
				Body: audio.AudioStream,
				Bucket: process.env.AWS_BUCKET_NAME || '',
				Key: filename
			})
			.promise();
		if (!audio_file) return null;

		return `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${filename}`;
	}
});
