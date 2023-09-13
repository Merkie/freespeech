import { ELEVEN_LABS_KEY, SITE_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Cryptr from 'cryptr';

export const GET = async ({ locals: { user }, fetch }) => {
	let elApiKey = '';

	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': elApiKey || ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	return json(
		voices.map((voice: { category: string; name: string }) => ({
			...voice,
			fsSlug: `[${voice.category}] ${voice.name}`
		}))
	);
};
