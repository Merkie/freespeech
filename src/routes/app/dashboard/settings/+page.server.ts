import { ELEVEN_LABS_ENDPOINT } from '$env/static/private';
import type { ElevenLabsVoice } from '$ts/common/types';

export const load = async () => {
	const voices = await getVoices();
	return { voices };
};

async function getVoices() {
	const response = await fetch(ELEVEN_LABS_ENDPOINT + '/voices/list');
	const data = await response.json();
	return data.voices as ElevenLabsVoice[];
}
