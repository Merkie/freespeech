import { writable } from 'svelte/store';
import type { User, Project, Page, Tile } from '@prisma/client';
import { browser } from '$app/environment';

export type AppModes = 'home' | 'edit' | 'dashboard';
export const AppMode = writable<AppModes>('home');

export type UserExpanded = User & {
	projects: (Project & {
		pages: (Page & {
			tiles: Tile[];
		})[];
	})[];
};
export const CurrentUser = writable<UserExpanded | null>(null);
if (browser) {
	const storedCurrentUser = localStorage.getItem('freespeech-current-user');
	CurrentUser.set(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);
	CurrentUser.subscribe((value) => {
		localStorage.setItem('freespeech-current-user', JSON.stringify(value));
	});
}

export type ProjectExpanded = Project & {
	pages: (Page & {
		tiles: Tile[];
	})[];
};
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
