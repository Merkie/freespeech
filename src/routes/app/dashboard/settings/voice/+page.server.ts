/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEVEN_LABS_KEY } from '$env/static/private';
import { DecryptElevenLabsKey } from '$ts/server/decrypt-key';

export const load = async ({ locals: { user } }) => {
	const userKey = user.usePersonalElevenLabsKey ? DecryptElevenLabsKey(user.elevenLabsApiKey) : '';

	if (user.usePersonalElevenLabsKey && !userKey)
		return {
			voices: [],
			elevenLabsApiKey: user.elevenLabsApiKey,
			usePersonalElevenLabsKey: user.usePersonalElevenLabsKey
		};

	let voices = [];

	try {
		const response = await fetch('https://api.elevenlabs.io/v1/voices', {
			headers: {
				'xi-api-key': userKey || ELEVEN_LABS_KEY
			}
		}).then((res) => res.json());

		if (response.voices && Array.isArray(response.voices)) voices = response.voices;
	} catch {
		// empty
	}

	voices.sort((a: any, b: any) => {
		if (a.category === 'premade' && b.category !== 'premade') return 1;
		if (a.category !== 'premade' && b.category == 'premade') return -1;
		return a.name.localeCompare(b.name);
	});

	// filter out the "seductive" voices lol
	// TODO: add a setting for this
	const filteredVoices = voices.filter(
		(voice: any) =>
			!(voice.category === 'premade' && voice.labels.description?.includes('seductive'))
	);

	return {
		voices: filteredVoices,
		elevenLabsApiKey: userKey,
		usePersonalElevenLabsKey: user.usePersonalElevenLabsKey
	};
};
