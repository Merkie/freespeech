import type { Project, Tile, TilePage, User } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';

export enum DashboardPages {
	account = 'account',
	projects = 'projects',
	uploads = 'uploads',
	advanced = 'advanced'
}

export enum EditorTools {
	text = 'text',
	image = 'image',
	move = 'move',
	color = 'color',
	accent = 'accent',
	invisible = 'invisible',
	navigate = 'navigate',
	template = 'template',
	trash = 'trash'
}

// Object that stores the entire user object
export const Me: Writable<
	User & { projects: (Project & { pages: (TilePage & { tiles: Tile[] })[] })[] }
> = writable();
// The active project
export const AppProject = writable<Project & { pages: (TilePage & { tiles: Tile[] })[] }>();
export const CurrentPageId = writable<number>();
// The name of the current page
// export const CurrentPageName = writable<string>('Home');
// What page the user in on in the dashboard
export const DashboardPage: Writable<DashboardPages> = writable(DashboardPages.account);
// the tool that the user has selected
export const EditorTool: Writable<EditorTools> = writable(EditorTools.text);
// if the user is in edit mode
export const InEditMode = writable<boolean>(false);
// if the user is in the settings page
export const InSettingsPage = writable<boolean>(false);
// the tile that is currently being edited in the navigation menu
export const NavigationTile = writable<Tile | null>(null);
