import { writable } from 'svelte/store';
import type { User, Project, Page, Tile } from '$lib/types';
import { browser } from '$app/environment';
import type { AppModes, UserExpanded, ProjectExpanded } from '$lib/types';

export const AppMode = writable<AppModes>('home');

export const CurrentUser = writable<UserExpanded | null>(null);
if (browser) {
	const storedCurrentUser = localStorage.getItem('freespeech-current-user');
	CurrentUser.set(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);
	CurrentUser.subscribe((value) => {
		localStorage.setItem('freespeech-current-user', JSON.stringify(value));
	});
}

export const CurrentProject = writable<ProjectExpanded | null>(null);
if (browser) {
	const storedCurrentProject = localStorage.getItem('freespeech-current-project');
	CurrentProject.set(storedCurrentProject ? JSON.parse(storedCurrentProject) : null);
	CurrentProject.subscribe((value) => {
		localStorage.setItem('freespeech-current-project', JSON.stringify(value));
	});
}

export const CurrentPage = writable<string>('home');
export const SelectedEditModeTool = writable<string>('cursor');
export const EditModeNavigation = writable<{
	tileid: string | undefined;
	pagename: string | undefined;
}>({ tileid: undefined, pagename: undefined });
export const EditModeColor = writable<{ mode: 'background' | 'border' | 'text'; color: string }>({
	mode: 'border',
	color: 'zinc-400'
});

export const Sentence = writable<Tile[]>([]);
export const DashboardPage = writable<string>('library');
