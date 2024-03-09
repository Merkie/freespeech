import type { LocalSettings } from '$ts/common/types';

export default async function Speak({
	settings,
	text,
	elevenlabsEndpoint
}: {
	settings: LocalSettings;
	text: string;
	elevenlabsEndpoint?: string;
}) {
	switch (settings.voiceGenerator) {
		case 'elevenlabs': {
			const response = await fetch(elevenlabsEndpoint + '/speak', {
				method: 'POST',
				body: JSON.stringify({ voice_id: settings.elevenLabsVoice, text }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const blob = await response.blob();

			const audio = new Audio();
			audio.src = URL.createObjectURL(blob);
			audio.play();
			break;
		}

		case 'offline': {
			const utterance = new SpeechSynthesisUtterance(text);

			const foundVoice = speechSynthesis
				.getVoices()
				.find((voice) => voice.name === settings.offlineVoice);

			if (foundVoice) {
				utterance.voice = foundVoice;
			}

			speechSynthesis.speak(utterance);

			break;
		}
	}
}
