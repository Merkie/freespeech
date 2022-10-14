// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';

// Prisma
import prismaClient from '$lib/server/prismaClient';

import aws from 'aws-sdk';
import dotenv from 'dotenv';
import type { Context } from '../context';
import type { IMeta } from '../IMeta';
dotenv.config();

// init AWS Polly
const polly = new aws.Polly({
	signatureVersion: 'v4',
	region: 'us-east-1',
	accessKeyId: process.env.FS_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.FS_AWS_SECRET_ACCESS_KEY
});

export default router<Context, IMeta>().mutation('synthesise', {
	input: z.object({
		text: z.string(),
		engine: z.string(),
		voiceId: z.string()
	}),
	resolve: async ({ input }) => {
		let params = {
			Engine: input.engine,
			Text: input.text,
			OutputFormat: 'mp3',
			VoiceId: input.voiceId
		};

		// Get the audio back
		const audio = await polly.synthesizeSpeech(params).promise();
		if (!audio.AudioStream) return null;

		// Convert the buffer to base64 and return
		return 'data:audio/mpeg;base64,' + audio.AudioStream.toString('base64');
	}
});
