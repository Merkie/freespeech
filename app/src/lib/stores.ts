import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// Types
import type { Project, Tile, TilePage } from '@prisma/client';
import { DashboardPages } from './types';

// The current page selected in the dashboard
export const SelectedDashboardPage: Writable<DashboardPages> = writable(DashboardPages.projects);

// The project data in the app
export const ProjectData: Writable<Project & { pages: TilePage[] & { tiles: Tile[] }[] }> =
	writable();

// The tile that is being inspected in the app
export const InspectedTile: Writable<Tile | undefined> = writable();

// If the user is in edit mode in the app
export const IsInEditMode: Writable<boolean> = writable(false);

// The sentence that the user is currently editing
export const AppSentence: Writable<Tile[]> = writable([]);

// The current page that the user is on in the app
export const CurrentPageIndex: Writable<number> = writable(0);

export const PageHistory: Writable<string[]> = writable(['HOME']);
export const PageHistoryIndex: Writable<number> = writable(0);
export const EditedTiles: Writable<Tile[]> = writable([]);
export const IsEditingDragging: Writable<boolean> = writable(false);
export const IsEditingInspect: Writable<boolean> = writable(true);
export const IsEditingColor: Writable<boolean> = writable(false);
export const IsEditingTrash: Writable<boolean> = writable(false);
export const IsEditingAccent: Writable<boolean> = writable(false);
export const IsEditingInvisible: Writable<boolean> = writable(false);
export const IsEditingTemplate: Writable<boolean> = writable(false);
export const EditingColor: Writable<string> = writable('red');
export const EditingType: Writable<string> = writable('background'); // background, text, border
export const InSettingsMenu: Writable<boolean> = writable(false);

// const storedTileSize = parseInt(localStorage.getItem('freespeech-tile-size') + '') || 100;
// export const UserTileSize: Writable<number> = writable(storedTileSize);

// Tile Size
const initialTileSize = browser
	? window.localStorage.getItem('freespeech-tile-size') ?? '100'
	: '100';
export const UserTileSize = writable<number>(parseInt(initialTileSize + ''));
UserTileSize.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('freespeech-tile-size', value + '');
	}
});

// Font Size
const initialFontSize = browser
	? window.localStorage.getItem('freespeech-font-size') ?? '20'
	: '20';
export const UserFontSize = writable<number>(parseInt(initialFontSize + ''));
UserFontSize.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('freespeech-font-size', value + '');
	}
});
