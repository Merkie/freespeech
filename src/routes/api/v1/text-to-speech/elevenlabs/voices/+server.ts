import { ELEVEN_LABS_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ fetch }) => {
	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	return json({ voices });
};
