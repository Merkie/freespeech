import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { SITE_SECRET } from '$env/static/private';
import Cryptr from 'cryptr';

export const POST = async ({ locals: { prisma, user }, request }) => {
	const schema = z.object({
		name: z.string().min(1).optional(),
		profileImgUrl: z.string().min(1).optional(),
		elevenLabsApiKey: z.string().optional()
	});

	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	const fetchedUser = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	});

	if (!fetchedUser) return json({ error: 'User not found' });

	let encryptedElApiKey = '';

	if (body.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		encryptedElApiKey = cryptr.encrypt(body.elevenLabsApiKey);
	}

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			name: body.name || fetchedUser.name,
			profileImgUrl: body.profileImgUrl || fetchedUser.profileImgUrl,
			elevenLabsApiKey:
				body.elevenLabsApiKey === '' ? null : encryptedElApiKey || fetchedUser.elevenLabsApiKey
		}
	});

	return json({ success: true });
};
