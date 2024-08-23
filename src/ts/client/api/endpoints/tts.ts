/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_API_URL } from '$env/static/public';
import { ElevenLabsVoiceId } from '$ts/client/stores';
import { get } from 'svelte/store';

const tts = {
	speak: {
		elevenlabs: ElevenLabsSpeak
	},
	voices: {
		elevenlabs: ElevenLabsVoices
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

async function ElevenLabsVoices(token?: string) {
	const response = await fetch(PUBLIC_API_URL + '/text-to-speech/elevenlabs/voices', {
		headers: {
			Authorization: `Bearer ${token ? token : localStorage.getItem('token')}`,
			'Content-Type': 'application/json'
		}
	});

	const json = (await response.json()) as {
		voices: any[];
		error: string;
	};

	return json;
}
