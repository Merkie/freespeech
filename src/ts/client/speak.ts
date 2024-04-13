import { Howl } from 'howler';
import { ElevenLabsVoiceId, VoiceEngineStatus } from './stores';
import { get } from 'svelte/store';

export async function speakText(text: string) {
	VoiceEngineStatus.set('synthesizing');

	const response = await fetch('/api/v1/text-to-speech/elevenlabs/speak', {
		method: 'POST',
		body: JSON.stringify({
			text,
			voiceId: get(ElevenLabsVoiceId)
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const data = await response.blob();

	const sound = new Howl({
		src: [URL.createObjectURL(data)],
		format: ['mp3']
	});

	VoiceEngineStatus.set('speaking');

	sound.play();

	sound.on('end', () => {
		VoiceEngineStatus.set('ready');
	});
}
