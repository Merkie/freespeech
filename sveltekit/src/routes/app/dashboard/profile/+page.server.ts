import { SITE_SECRET } from '$env/static/private';
import Cryptr from 'cryptr';

export const load = async ({ locals: { user } }) => {
	let elevenLabsApiKey = '';

	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elevenLabsApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	return { elevenLabsApiKey };
};
