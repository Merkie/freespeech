import { Howl } from 'howler';
import {
	ElevenLabsVoiceId,
	EnableThirdPartyVoiceProviders,
	OfflineVoiceUri,
	VoiceEngineStatus
} from './stores';
import { get } from 'svelte/store';
import api from './api';

export async function speakText(text: string) {
	VoiceEngineStatus.set('synthesizing');

	if (!get(EnableThirdPartyVoiceProviders) || !get(ElevenLabsVoiceId)) return speakSynth(text);

	const data = await api.tts.speak.elevenlabs(text);

	const sound = new Howl({
		src: [URL.createObjectURL(data)],
		format: ['mp3']
	});

	VoiceEngineStatus.set('speaking');

	sound.play();

	sound.on('end', () => {
		VoiceEngineStatus.set('ready');
	});

	sound.on('loaderror', () => {
		speakSynth(text);
	});
}

function speakSynth(text: string) {
	const synthVoiceUri = get(OfflineVoiceUri);

	// make speech synthesis request
	const synth = new SpeechSynthesisUtterance(text);
	const synthVoices = speechSynthesis.getVoices();

	if (!synthVoices || !synthVoices.length) return VoiceEngineStatus.set('failed');

	const voice = speechSynthesis.getVoices().find((voice) => voice.voiceURI === synthVoiceUri);
	if (voice) {
		synth.voice = voice;
	}

	speechSynthesis.speak(synth);

	synth.onend = () => {
		VoiceEngineStatus.set('ready');
	};
}
