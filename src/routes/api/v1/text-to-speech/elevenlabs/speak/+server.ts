import { ELEVEN_LABS_KEY } from '$env/static/private';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { DecryptElevenLabsKey } from '$ts/server/decrypt-key';

const schema = z.object({
	voiceId: z.string().min(1),
	text: z.string().min(1).max(1500)
});

export const POST = async ({ locals: { user }, request, fetch }) => {
	const body = (await request.json()) as z.infer<typeof schema>;
	if (!schema.safeParse(body)) return json({ error: 'Invalid request body' }, { status: 400 });

	const userKey = DecryptElevenLabsKey(user.elevenLabsApiKey);

	if (user.usePersonalElevenLabsKey && !userKey)
		return json(
			{
				error: 'User has enabled personal Eleven Labs API key but it is not set'
			},
			{
				status: 403
			}
		);

	const startTime = Date.now();

	// Make the request to the Eleven Labs API
	const response = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${body.voiceId}?optimize_streaming_latency=1`,
		{
			method: 'POST',
			headers: {
				Accept: 'audio/mpeg',
				'Content-Type': 'application/json',
				'xi-api-key': userKey || ELEVEN_LABS_KEY
			},
			body: JSON.stringify({
				text: body.text
			})
		}
	);

	// response body is mp3 audio
	const audio = await response.arrayBuffer();

	console.log('Eleven Labs API request took', Date.now() - startTime, 'ms');

	// send to client
	return new Response(audio, {
		headers: {
			'Content-Type': 'audio/mpeg'
		}
	});
};
