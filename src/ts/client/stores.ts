import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { FullProject, Tile, ILocalSettings, IModal } from '$ts/common/types';

export const ActiveProject = writable<FullProject | null>(null); // stored
export const LocalSettings = writable<ILocalSettings>({
	offlineVoice: '',
	elevenLabsVoice: 'Rachel',
	voiceGenerator: 'offline',
	speakOnTap: true,
	sentenceBuilder: true
});
export const isSynthesizingSpeech = writable(false);
export const ActivePage = writable('Home');
export const Sentence = writable<Tile[]>([]);
export const Loading = writable(false);
export const isEditing = writable(false);
export const hasUnsavedChanges = writable(false);
export const openModal = writable<IModal>({ name: '' });

export const TileBeingEdited = writable<Tile | null>(null);
export const UsingOnlineSearch = writable(false);

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
	// LocalSettings
	const localSettings = localStorage.getItem('localSettings');
	if (localSettings) {
		LocalSettings.set(JSON.parse(localSettings));
	}
	LocalSettings.subscribe((value) => {
		if (value) {
			localStorage.setItem('localSettings', JSON.stringify(value));
		} else {
			localStorage.removeItem('localSettings');
		}
	});
}
