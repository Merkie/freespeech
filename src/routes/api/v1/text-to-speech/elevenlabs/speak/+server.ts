import { ELEVEN_LABS_KEY, SITE_SECRET } from '$env/static/private';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import Cryptr from 'cryptr';

export const POST = async ({ locals: { user }, request, fetch }) => {
	const schema = z.object({
		name: z.string().min(1),
		text: z.string().min(1).max(1500)
	});

	const body = (await request.json()) as z.infer<typeof schema>;

	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' });

	const elVoices = await fetch('/api/v1/text-to-speech/elevenlabs/voices').then((res) =>
		res.json()
	);

	let elApiKey = '';

	if (user.elevenLabsApiKey) {
		const cryptr = new Cryptr(SITE_SECRET);
		elApiKey = cryptr.decrypt(user.elevenLabsApiKey);
	}

	// Make the request to the Eleven Labs API
	const response = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${
			elVoices.find((voice: { fsSlug: string }) => voice.fsSlug === body.name)?.voice_id
		}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'xi-api-key': elApiKey || ELEVEN_LABS_KEY
			},
			body: JSON.stringify({
				text: body.text,
				model_id: 'eleven_multilingual_v2',
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
