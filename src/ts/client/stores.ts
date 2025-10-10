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
export const UsingOnlineSearch = writable(false);
export const TileBeingEdited = writable<Tile | null>(null);

export const EditingPages = writable(false);
export const AddingPage = writable(false);
export const PageBeingEdited = writable<TilePage | null>(null);

export const EditingProjects = writable(false);
export const AddingProject = writable(false);
export const ProjectBeingEdited = writable<Project | null>(null);

export const VoiceEngineStatus = writable<'ready' | 'speaking' | 'synthesizing' | 'failed'>(
	'ready'
);

// voice settings
export const EnableThirdPartyVoiceProviders = writable(false);
export const ElevenLabsVoiceId = writable<string | null>(null);
export const OfflineVoiceUri = writable<string | null>(null);

// behavior settings
export const EnableSentenceCopyButton = writable(false);

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
}

// Browser-based settings

export const LocalSettings = writable<LocalSettingsType>({
	offlineVoice: '',
	elevenLabsVoice: 'Rachel',
	voiceGenerator: 'offline',
	speakOnTap: true,
	sentenceBuilder: true,
	skinTone: 'medium',
	lastVisitedProjectId: ''
});

if (browser) {
	const localSettings = localStorage.getItem('localSettings');
	if (localSettings) {
		LocalSettings.set({ ...LocalSettings, ...JSON.parse(localSettings) });
	}
	LocalSettings.subscribe((value) => {
		if (value) {
			localStorage.setItem('localSettings', JSON.stringify(value));
		} else {
			localStorage.removeItem('localSettings');
		}
	});
}
