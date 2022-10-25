import type { Project, Tile, TilePage, User, Organization } from '@prisma/client';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

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
	swap = 'swap',
	accent = 'accent',
	invisible = 'invisible',
	silent = 'silent',
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
// the project in the clone modal
export const CloneModalProject = writable<Project | null>(null);
// the tile that is currently being swapped
export const SwappedTile = writable<Tile | null>(null);
// the mode of the text editor
export const EditTextMode = writable<'display' | 'speak'>('display');
// list of edited tiles to update when changes are saved
export const EditedTiles = writable<string[]>([]);
// Tile that is currently being conjugated
export const ConjugatingTile = writable<Tile | null>(null);
// Page that is being templated from
export const TemplatingPageId = writable<number | null>(null);

// Selected voice persistent storage
export const SelectedVoice = writable(
	(browser && localStorage.getItem('freespeech-voice')) || '[AWS] Kimberly (en-US female) Neural'
);
SelectedVoice.subscribe((val) => {
	if (browser) return (localStorage['freespeech-voice'] = val);
});

// Selected style persistent storage
export const SelectedStyle = writable(
	(browser && localStorage.getItem('freespeech-style')) || 'friendly'
);
SelectedStyle.subscribe((val) => {
	if (browser) return (localStorage['freespeech-style'] = val);
});

// Guided Access persistent storage
export const GuidedAccessPin = writable<String>(
	(browser && localStorage.getItem('freespeech-guided-access')) || ''
);
GuidedAccessPin.subscribe((val) => {
	if (browser) return (localStorage['freespeech-guided-access'] = val);
});

// Columns override persistent storage
export const ColumnCountOverride = writable<String>(
	(browser && localStorage.getItem('freespeech-column-override')) || ''
);
GuidedAccessPin.subscribe((val) => {
	if (browser) return (localStorage['freespeech-column-override'] = val);
});

// Tile overflow setting persistent storage
export const TileOverflow = writable<'break' | 'ellipses'>(
	(browser && (localStorage.getItem('freespeech-tile-overflow') as 'break' | 'ellipses')) ||
		'ellipses'
);
GuidedAccessPin.subscribe((val) => {
	if (browser) return (localStorage['freespeech-tile-overflow'] = val);
});
