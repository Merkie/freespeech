import type { Project, TilePage } from '@prisma/client';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type Tile from '$ts/types/Tile';

export type VoiceGeneratorOption = 'elevenlabs' | 'offline';

export const ActiveProject = writable<(Project & { pages: TilePage[] }) | null>(null); // stored
export const OfflineVoice = writable(''); // stored
export const ElevenLabsVoice = writable(''); // stored
export const isSynthesizingSpeech = writable(false);
export const VoiceGenerator = writable<VoiceGeneratorOption>('offline'); // stored
export const SpeakOnTap = writable(true); // stored
export const ActivePage = writable('Home');
export const Sentence = writable<Tile[]>([]);
export const Loading = writable(false);
export const isEditing = writable(false);
export const hasUnsavedChanges = writable(false);

if (browser) {
	// ActiveProject
	const project = localStorage.getItem('activeProject');
	if (project) {
		ActiveProject.set(JSON.parse(project));
	}
	ActiveProject.subscribe((value) => {
		if (value) {
			localStorage.setItem('activeProject', JSON.stringify(value));
		} else {
			localStorage.removeItem('activeProject');
		}
	});
	// OfflineVoice
	const offlineVoice = localStorage.getItem('offlineVoice');
	if (offlineVoice) {
		OfflineVoice.set(offlineVoice);
	}
	OfflineVoice.subscribe((value) => {
		if (value) {
			localStorage.setItem('offlineVoice', value);
		} else {
			localStorage.removeItem('offlineVoice');
		}
	});
	// ElevenLabsVoice
	const elevenLabsVoice = localStorage.getItem('elevenLabsVoice');
	if (elevenLabsVoice) {
		ElevenLabsVoice.set(elevenLabsVoice);
	}
	ElevenLabsVoice.subscribe((value) => {
		if (value) {
			localStorage.setItem('elevenLabsVoice', value);
		} else {
			localStorage.removeItem('elevenLabsVoice');
		}
	});
	// VoiceGenerator
	const voiceGenerator = localStorage.getItem('voiceGenerator');
	if (voiceGenerator) {
		VoiceGenerator.set(voiceGenerator as VoiceGeneratorOption);
	}
	VoiceGenerator.subscribe((value) => {
		if (value) {
			localStorage.setItem('voiceGenerator', value);
		} else {
			localStorage.removeItem('voiceGenerator');
		}
	});
	//	SpeakOnTap
	const speakOnTap = localStorage.getItem('speakOnTap') === 'true';
	SpeakOnTap.set(speakOnTap);

	SpeakOnTap.subscribe((value) => {
		if (value) {
			localStorage.setItem('speakOnTap', value ? 'true' : 'false');
		} else {
			localStorage.removeItem('speakOnTap');
		}
	});
}
