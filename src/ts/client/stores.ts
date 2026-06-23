import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { LocalSettings as LocalSettingsType } from '$ts/common/types';
import type { TilePage, Tile, Project } from '$ts/common/types';

export const isSynthesizingSpeech = writable(false);
export const Sentence = writable<Tile[]>([]);
export const Loading = writable(false);

// Modals & Panels

export const UnsavedChanges = writable(false);
export const DiscardUnsavedChangesHandler = writable<() => void>(() => {});
export const UnsavedChangesModalOpen = writable(false);

export const EditingTiles = writable(false);
// Access-control PIN modals
export const PinEntryModalOpen = writable(false);
export const PinSetupModalOpen = writable(false);
// What to run after a correct PIN, and the prompt shown while entering it.
export const PinUnlockHandler = writable<() => void>(() => {});
export const PinPromptText = writable('Enter your PIN to continue.');
export const UsingOnlineSearch = writable(false);
export const TileBeingEdited = writable<Tile | null>(null);
// The tile currently being dragged in edit mode (drag-to-move).
export const DraggedTile = writable<Tile | null>(null);

export const EditingPages = writable(false);
export const AddingPage = writable(false);
export const PageBeingEdited = writable<TilePage | null>(null);
export const ProjectPages = writable<TilePage[]>([]);
export const ProjectPagesLoading = writable(false);
export const BoardRefreshVersion = writable(0);
export const requestBoardRefresh = () => BoardRefreshVersion.update((version) => version + 1);

// Registered by the board page so tile mutations can update the on-screen board
// immediately (optimistically) before the server round-trip completes, avoiding
// the tile snapping back to its old position and then forward again.
export const ApplyOptimisticBoardUpdate = writable<((mutate: (tiles: Tile[]) => Tile[]) => void) | null>(
	null
);

export const EditingProjects = writable(false);
export const AddingProject = writable(false);
export const ProjectBeingEdited = writable<Project | null>(null);

export const ImportingProject = writable(false);

export const VoiceEngineStatus = writable<'ready' | 'speaking' | 'synthesizing' | 'failed'>(
	'ready'
);

// voice settings
export const EnableThirdPartyVoiceProviders = writable(false);
export const ElevenLabsVoiceId = writable<string | null>(null);
export const OfflineVoiceUri = writable<string | null>(null);

// behavior settings
export const EnableSentenceCopyButton = writable(false);
export const EnableTileAnimations = writable(true);

if (browser) {
	const enableThirdPartyVoiceProviders = localStorage.getItem('enableThirdPartyVoiceProviders');
	if (enableThirdPartyVoiceProviders) {
		EnableThirdPartyVoiceProviders.set(enableThirdPartyVoiceProviders === 'true');
	}
	EnableThirdPartyVoiceProviders.subscribe((value) => {
		localStorage.setItem('enableThirdPartyVoiceProviders', value.toString());
	});

	const elevenLabsVoiceId = localStorage.getItem('elevenLabsVoiceId');
	if (elevenLabsVoiceId) {
		ElevenLabsVoiceId.set(elevenLabsVoiceId);
	}
	ElevenLabsVoiceId.subscribe((value) => {
		if (value) {
			localStorage.setItem('elevenLabsVoiceId', value);
		} else {
			localStorage.removeItem('elevenLabsVoiceId');
		}
	});

	const offlineVoiceUri = localStorage.getItem('offlineVoiceUri');
	if (offlineVoiceUri) {
		OfflineVoiceUri.set(offlineVoiceUri);
	}
	OfflineVoiceUri.subscribe((value) => {
		if (value) {
			localStorage.setItem('offlineVoiceUri', value);
		} else {
			localStorage.removeItem('offlineVoiceUri');
		}
	});

	const enableSentenceCopyButton = localStorage.getItem('enableSentenceCopyButton');
	if (enableSentenceCopyButton) {
		EnableSentenceCopyButton.set(enableSentenceCopyButton === 'true');
	}
	EnableSentenceCopyButton.subscribe((value) => {
		localStorage.setItem('enableSentenceCopyButton', value.toString());
	});

	const enableTileAnimations = localStorage.getItem('enableTileAnimations');
	if (enableTileAnimations) {
		EnableTileAnimations.set(enableTileAnimations === 'true');
	}
	EnableTileAnimations.subscribe((value) => {
		localStorage.setItem('enableTileAnimations', value.toString());
	});
}

// Browser-based settings

const defaultLocalSettings: LocalSettingsType = {
	offlineVoice: '',
	elevenLabsVoice: 'Rachel',
	voiceGenerator: 'offline',
	speakOnTap: true,
	sentenceBuilder: true,
	skinTone: 'medium',
	lastVisitedProjectId: '',
	lastVisitedPageId: '',
	lastVisitedHomePageId: '',
	editPinEnabled: false,
	editPinHash: '',
	editPinSalt: '',
	editPinFailureCount: 0,
	editPinLockoutUntil: 0
};

export const LocalSettings = writable<LocalSettingsType>(defaultLocalSettings);

if (browser) {
	const localSettings = localStorage.getItem('localSettings');
	if (localSettings) {
		LocalSettings.set({ ...defaultLocalSettings, ...JSON.parse(localSettings) });
	}
	LocalSettings.subscribe((value) => {
		if (value) {
			localStorage.setItem('localSettings', JSON.stringify(value));
		} else {
			localStorage.removeItem('localSettings');
		}
	});
}
