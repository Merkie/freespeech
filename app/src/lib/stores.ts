import { writable, type Writable } from 'svelte/store';
import { DashboardPages } from './types';
import type { Project, Tile, TilePage } from '@prisma/client';

// the current page in the /dashboard panel
export const SelectedDashboardPage: Writable<DashboardPages> = writable(DashboardPages.projects);
export const ProjectData: Writable<Project & { pages: TilePage[] & { tiles: Tile[] }[] }> =
	writable();
