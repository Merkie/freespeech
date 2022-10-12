import type { Project, Tile, TilePage, User, Organization } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';

export enum DashboardPages {
	account = 'account',
	projects = 'projects',
	uploads = 'uploads',
	advanced = 'advanced',
	explore = 'explore'
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
	User & {
		organization: Organization;
		projects: (Project & { pages: (TilePage & { tiles: Tile[] })[] })[];
	}
> = writable();
// The active project
export const AppProject = writable<Project & { pages: (TilePage & { tiles: Tile[] })[] }>();
// Id of the current page
export const CurrentPageId = writable<number>();
// What page the user in on in the dashboard
export const DashboardPage: Writable<DashboardPages | string> = writable(DashboardPages.account);
// the tool that the user has selected
export const EditorTool: Writable<EditorTools> = writable(EditorTools.text);
// if the user is in edit mode
export const InEditMode = writable<boolean>(false);
// if the user is in the settings page
export const InSettingsPage = writable<boolean>(false);
// the tile that is currently being edited in the navigation menu
export const NavigationTile = writable<Tile | null>(null);
// selected color
export const SelectedColor = writable<string | null>();
// selected color mode
export const SelectedColorMode = writable<'border' | 'background' | 'text'>('border');
// page history
export const PageHistory = writable<number[]>([]);
// page history index
export const PageHistoryIndex = writable<number>(0);
// sentence
export const Sentence = writable<Tile[]>([]);
// if in project creation modal
export const IsProjectCreationModalOpen = writable<boolean>(false);
