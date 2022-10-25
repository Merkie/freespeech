// Trpc
import { router } from '@trpc/server';
import { z, ZodString } from 'zod';
import { Configuration, OpenAIApi } from 'openai';

// Prisma
import prismaClient from '$lib/server/prismaClient';

import type { Context } from '../context';
import type { IMeta } from '../IMeta';

// init openai
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default router<Context, IMeta>().mutation('conjugate', {
	input: z.string(),
	resolve: async ({ input }) => {
		const response = await openai.createCompletion({
			model: 'text-davinci-002',
			prompt: `list all english conjugations and variations of the word "${input}", one word only, comma seperated list:`,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0
		});
		if (!response) return null;

		//@ts-ignore
		const conjugated = response.data.choices[0].text.split(',').map((word) => word.trim());

		return conjugated;
	}
});
