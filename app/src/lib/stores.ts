import { writable, type Writable } from 'svelte/store';
import { DashboardPages } from './types';

// the current page in the /dashboard panel
export const SelectedDashboardPage: Writable<DashboardPages> = writable(DashboardPages.projects);
