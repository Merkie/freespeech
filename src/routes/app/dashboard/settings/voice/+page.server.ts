/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEVEN_LABS_KEY, SITE_SECRET } from '$env/static/private';
import Cryptr from 'cryptr';

export const load = async ({ locals: { user } }) => {
	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	let elevenLabsApiKey = '';

	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elevenLabsApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	return { voices, elevenLabsApiKey };
};
