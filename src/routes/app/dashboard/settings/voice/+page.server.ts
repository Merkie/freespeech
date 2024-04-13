/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEVEN_LABS_KEY } from '$env/static/private';
import { DecryptElevenLabsKey } from '$ts/server/decrypt-key';

export const load = async ({ locals: { user } }) => {
	const userKey = DecryptElevenLabsKey(user.elevenLabsApiKey);

	if (user.usePersonalElevenLabsKey && !userKey)
		return {
			voices: [],
			elevenLabsApiKey: user.elevenLabsApiKey,
			usePersonalElevenLabsKey: user.usePersonalElevenLabsKey
		};

	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': userKey || ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	return {
		voices,
		elevenLabsApiKey: userKey,
		usePersonalElevenLabsKey: user.usePersonalElevenLabsKey
	};
};
