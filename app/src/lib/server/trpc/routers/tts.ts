// Trpc
import { router } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../context';
import type { IMeta } from '../IMeta';

// TTS
import AzureTTS from '$lib/server/tts/Azure';

export default router<Context, IMeta>()
	.query('azure_voices', {
		resolve: async ({ ctx }) => {
			const voices = await fetch(
				'https://' +
					process.env.AZURE_SPEECH_REGION +
					'.tts.speech.microsoft.com/cognitiveservices/voices/list',
				{
					method: 'GET',
					headers: {
						'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY + ''
					}
				}
			);

			return await voices.json();
		}
	})
	.mutation('azure_tts', {
		input: z.object({
			text: z.string(),
			voice: z.string(),
			style: z.string().optional()
		}),
		resolve: async ({ ctx, input }) => {
			return await AzureTTS(input.text, input.voice, input.style || 'default');
		}
	});
