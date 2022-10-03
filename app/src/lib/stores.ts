import { writable, type Writable } from 'svelte/store';

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
export const InSettingsMenu: Writable<boolean> = writable(false);
