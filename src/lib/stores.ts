import { writable } from 'svelte/store';
import type { Tile } from '$lib/types';
import { browser } from '$app/environment';
import type { AppModes, UserExpanded, ProjectExpanded } from '$lib/types';

// Application Mode
export const AppMode = writable<AppModes>('home');

// Current User
export const CurrentUser = writable<UserExpanded | null>(null);
if (browser) {
	const storedCurrentUser = localStorage.getItem('freespeech-current-user');
	CurrentUser.set(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);
	CurrentUser.subscribe((value) => {
		localStorage.setItem('freespeech-current-user', JSON.stringify(value));
	});
}

// Current Project
export const CurrentProject = writable<ProjectExpanded | null>(null);
if (browser) {
	const storedCurrentProject = localStorage.getItem('freespeech-current-project');
	CurrentProject.set(storedCurrentProject ? JSON.parse(storedCurrentProject) : null);
	CurrentProject.subscribe((value) => {
		localStorage.setItem('freespeech-current-project', JSON.stringify(value));
	});
}
// Sentence (for the sentence builder)
export const Sentence = writable<Tile[]>([]);

// Current Page (name of page)
export const CurrentPage = writable<string>('home');

// Selected Tool in edit mode
export const SelectedEditModeTool = writable<string>('cursor');

// For the navigation tool in edit mode
export const EditModeNavigation = writable<{
	tileid: string | undefined;
	pagename: string | undefined;
}>({ tileid: undefined, pagename: undefined });

// For the color tool in edit mode
export const EditModeColor = writable<{
	mode: 'background' | 'border' | 'text';
	color: string;
	value: number;
}>({
	mode: 'border',
	color: 'zinc',
	value: 500
});

// The current page in dashboard mode
export const DashboardPage = writable<string>('library');

const defaultSettings = {
	renderImagesAsBase64: false,
	displayImagesInMixMode: false,
	offlineVoiceIndex: 0
};
export const ApplicationSettings = writable<{
	renderImagesAsBase64: boolean;
	displayImagesInMixMode: boolean;
	offlineVoiceIndex: number;
}>(defaultSettings);
if (browser) {
	const storedApplicationSettings = localStorage.getItem('freespeech-application-settings');
	ApplicationSettings.set(
		storedApplicationSettings ? JSON.parse(storedApplicationSettings) : defaultSettings
	);
	ApplicationSettings.subscribe((value) => {
		localStorage.setItem('freespeech-application-settings', JSON.stringify(value));
	});
}
