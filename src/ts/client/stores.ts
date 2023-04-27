import type { Project, TilePage } from '@prisma/client';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const AppMode = writable<'home' | 'edit' | 'dashboard'>('home');
export const ActiveProject = writable<(Project & { pages: TilePage[] }) | null>(null);
export const ActivePage = writable('Home');
export const Loading = writable(false);

if (browser) {
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
}

// export const Edits = writable<{ type: string; id: string; data: any }[]>([]);
