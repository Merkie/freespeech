import { ELEVEN_LABS_KEY } from '$env/static/private';

export const GET = async ({ locals, fetch }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(
			JSON.stringify({ error: 'You must be logged in access Eleven Labs API routes.' }),
			{
				status: 401
			}
		);

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

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
