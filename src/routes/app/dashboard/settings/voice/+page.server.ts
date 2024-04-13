/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEVEN_LABS_KEY } from '$env/static/private';

export const load = async () => {
	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	return { voices };
};
