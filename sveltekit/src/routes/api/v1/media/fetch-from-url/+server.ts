import { z } from 'zod';

export const POST = async ({ request }) => {
	const schema = z.object({
		url: z.string().url()
	});
	const body = (await request.json()) as z.infer<typeof schema>;

	const response = await fetch(body.url);

	return response;
};
