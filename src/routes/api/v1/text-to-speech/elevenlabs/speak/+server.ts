import { ELEVEN_LABS_KEY } from '$env/static/private';
import voices from '$ts/common/ElevenLabsVoices';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const form = await superValidate(
		await request.json(),
		z.object({
			name: z.string().min(1),
			text: z.string().min(1).max(100)
		})
	);

	if (!form.valid) return json({ error: 'Invalid form' });

	// Make the request to the Eleven Labs API
	const response = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${voices.find(
			(voice) => voice.name === form.data.name
		)?.voice_id}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'xi-api-key': ELEVEN_LABS_KEY
			},
			body: JSON.stringify({
				text: form.data.text,
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
