import { PUBLIC_API_URL } from '$env/static/public';
import { ElevenLabsVoiceId } from '$ts/client/stores';
import { get } from 'svelte/store';

const tts = {
	speak: {
		elevenlabs: ElevenLabsSpeak
	}
};

export default tts;

async function ElevenLabsSpeak(text: string) {
	const response = await fetch(PUBLIC_API_URL + '/text-to-speech/elevenlabs/speak', {
		method: 'POST',
		body: JSON.stringify({
			text,
			voiceId: get(ElevenLabsVoiceId)
		}),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	});

	const data = await response.blob();

	return data;
}
