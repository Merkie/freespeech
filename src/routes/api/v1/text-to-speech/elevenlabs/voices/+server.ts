import { ELEVEN_LABS_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ fetch }) => {
	const response = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': ELEVEN_LABS_KEY
		}
	});

	const data = await response.json();

	// Remove all of the voices that aren't premade
	data.voices = data.voices.map((voice: { category: string }) => {
		if (voice.category === 'premade') return voice;
	});

	return json(data);
};
