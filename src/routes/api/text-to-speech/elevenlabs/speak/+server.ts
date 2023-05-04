import { ELEVEN_LABS_KEY } from '$env/static/private';
import ElevenLabsTTSSchema from '$ts/schema/ElevenLabsTTSSchema';
import voices from '$ts/types/ElevenLabsVoices';

export const POST = async ({ locals, request }) => {
	// Check if the user is logged in
	if (!locals.user)
		return new Response(
			JSON.stringify({ error: 'You must be logged in access Eleven Labs API routes.' }),
			{
				status: 401
			}
		);

	// Validate the request body
	const body = await request.json();
	const validation = ElevenLabsTTSSchema.safeParse(body);
	if (!validation.success) {
		return new Response(JSON.stringify({ error: validation.error }), {
			status: 400
		});
	}

	// Make the request to the Eleven Labs API
	const response = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${
			voices.find((voice) => voice.name === body.name)?.voice_id
		}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'xi-api-key': ELEVEN_LABS_KEY
			},
			body: JSON.stringify({
				text: body.text,
				model_id: 'eleven_monolingual_v1',
				voice_settings: {
					stability: 0.75,
					similarity_boost: 0.75
				}
			})
		}
	);

	// response body is mp3 audio
	const audio = await response.arrayBuffer();

	// send to client
	return new Response(audio, {
		headers: {
			'Content-Type': 'audio/mpeg'
		}
	});
};
