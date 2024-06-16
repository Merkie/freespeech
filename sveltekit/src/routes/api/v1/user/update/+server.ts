import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { SITE_SECRET } from '$env/static/private';
import Cryptr from 'cryptr';

export const POST = async ({ locals: { prisma, user }, request }) => {
	const schema = z.object({
		name: z.string().optional(),
		profileImgUrl: z.string().optional(),
		elevenLabsApiKey: z.string().optional(),
		usePersonalElevenLabsKey: z.boolean().optional()
	});

	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	const fetchedUser = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	});

	if (!fetchedUser) return json({ error: 'User not found' });

	if (body.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		body.elevenLabsApiKey = cryptr.encrypt(body.elevenLabsApiKey);
	}

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: body
	});

	return json({ success: true });
};
