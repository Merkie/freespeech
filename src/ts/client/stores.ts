import type { Project, TilePage } from '@prisma/client';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type VoiceGeneratorOption = 'elevenlabs' | 'offline';

export const AppMode = writable<'home' | 'edit' | 'dashboard'>('home');
export const ActiveProject = writable<(Project & { pages: TilePage[] }) | null>(null);
export const ActivePage = writable('Home');
export const ActiveDashboardPage = writable('projects');
export const Loading = writable(false);
export const OfflineVoice = writable('');
export const ElevenLabsVoice = writable('');
export const VoiceGenerator = writable<VoiceGeneratorOption>('offline');

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
}

// export const Edits = writable<{ type: string; id: string; data: any }[]>([]);
