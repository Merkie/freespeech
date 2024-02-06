import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { LocalSettings as LocalSettingsType } from '$ts/common/types';
import type { TilePage, Tile, Project } from '@prisma/client';

export const isSynthesizingSpeech = writable(false);
export const Sentence = writable<Tile[]>([]);
export const Loading = writable(false);

// Modals & Panels

export const UnsavedChanges = writable(false);
export const UnsavedChangesHandler = writable<() => void>(() => {});
export const UnsavedChangesModalOpen = writable(false);

export const EditingTiles = writable(false);
export const UsingOnlineSearch = writable(false);
export const TileBeingEdited = writable<Tile | null>(null);

export const EditingPages = writable(false);
export const AddingPage = writable(false);
export const PageBeingEdited = writable<TilePage | null>(null);

export const EditingProjects = writable(false);
export const AddingProject = writable(false);
export const ProjectBeingEdited = writable<Project | null>(null);

// Browser-based settings

export const LocalSettings = writable<LocalSettingsType>({
	offlineVoice: '',
	elevenLabsVoice: 'Rachel',
	voiceGenerator: 'offline',
	speakOnTap: true,
	sentenceBuilder: true,
	skinTone: 'medium',
	lastVisitedProjectId: ''
});

if (browser) {
	const localSettings = localStorage.getItem('localSettings');
	if (localSettings) {
		LocalSettings.set({ ...LocalSettings, ...JSON.parse(localSettings) });
	}
	LocalSettings.subscribe((value) => {
		if (value) {
			localStorage.setItem('localSettings', JSON.stringify(value));
		} else {
			localStorage.removeItem('localSettings');
		}
	});
}
