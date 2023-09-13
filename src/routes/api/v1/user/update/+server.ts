import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { SITE_SECRET } from '$env/static/private';
import Cryptr from 'cryptr';

export const POST = async ({ locals: { prisma, user }, request }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(1).optional(),
			profileImgUrl: z.string().min(1).optional(),
			elevenLabsApiKey: z.string().optional()
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	const fetchedUser = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	});

	if (!fetchedUser) return json({ error: 'User not found' });

	let encryptedElApiKey = '';

	if (form.data.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		encryptedElApiKey = cryptr.encrypt(form.data.elevenLabsApiKey);
	}

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			name: form.data.name || fetchedUser.name,
			profileImgUrl: form.data.profileImgUrl || fetchedUser.profileImgUrl,
			elevenLabsApiKey:
				form.data.elevenLabsApiKey === '' ? null : encryptedElApiKey || fetchedUser.elevenLabsApiKey
		}
	});

	return json({ success: true });
};
