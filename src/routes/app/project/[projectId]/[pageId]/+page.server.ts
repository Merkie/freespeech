import { ELEVEN_LABS_KEY, SITE_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import Cryptr from 'cryptr';

export const load = async ({ fetch, locals: { prisma, user }, params: { projectId, pageId } }) => {
	const page = await prisma.tilePage.findFirst({
		where: {
			id: pageId,
			userId: user.id,
			projectId: projectId
		},
		include: {
			tiles: true
		}
	});

	if (!page) throw redirect(302, '/app/dashboard/projects');

	const voicesData = await fetch('/api/v1/text-to-speech/elevenlabs/voices').then((res) =>
		res.json()
	);

	let elevenLabsApiKey = ELEVEN_LABS_KEY;
	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elevenLabsApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	return {
		page,
		elevenLabsVoices: voicesData,
		elevenLabsApiKey
	};
};
