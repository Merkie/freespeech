<script lang="ts">
	import { LocalSettings } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import elevenLabsVoices from '$ts/common/ElevenLabsVoices';
	import { fly } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import type { IElevenLabsVoice, IVoiceGenerator } from '$ts/common/types';
	import SearchBar from '$components/dashboard/SearchBar.svelte';
	import { writable } from 'svelte/store';

	type SettingType = 'select';

	type Setting = {
		name: string;
		description: string;
		type: SettingType;
		value: string;
		default: string;
		onInput: (e: Event) => void;
		options?: string[];
	};

	let offlineBrowserVoices: string[] = [];
	let settings: Setting[];
	let visible = false;
	let searchQuery = writable('');
	let searchSettings: Setting[] = [];

	onMount(async () => {
		visible = true;
		// Get all voices from the browser
		offlineBrowserVoices = speechSynthesis.getVoices().map((voice) => voice.name);

		// If there are no voices, wait for the voiceschanged event
		if (offlineBrowserVoices.length === 0) {
			return new Promise((resolve) => {
				speechSynthesis.onvoiceschanged = () => {
					offlineBrowserVoices = speechSynthesis.getVoices().map((voice) => voice.name);
					resolve(null);
				};
			});
		}
	});

	$: {
		settings = [
			{
				name: 'Offline Voice',
				description: `The offline voice is generated on your device without the need for an internet connection, however you are limited to what is natively supported on your device's browser.`,
				type: 'select',
				value: $LocalSettings.offlineVoice || offlineBrowserVoices[0],
				default: offlineBrowserVoices[0],
				options: offlineBrowserVoices,
				onInput: (e: Event) => {
					$LocalSettings = {
						...$LocalSettings,
						offlineVoice: (e.target as HTMLInputElement).value
					};
				}
			},
			{
				name: 'ElevenLabs Voice',
				description:
					'ElevenLabs voices are advanced AI-generated voices that sound extremely realistic. These voices are generated on a remote server and require an internet connection. For more information visit ElevenLabs.io',
				type: 'select',
				value: $LocalSettings.elevenLabsVoice || elevenLabsVoices.map((voice) => voice.name)[0],
				default: elevenLabsVoices.map((voice) => voice.name)[0],
				options: elevenLabsVoices.map((voice) => voice.name),
				onInput: (e: Event) => {
					$LocalSettings = {
						...$LocalSettings,
						elevenLabsVoice: (e.target as HTMLInputElement).value as IElevenLabsVoice
					};
				}
			},
			{
				name: 'Voice Generator',
				description: 'This decides with generator to use when generating voices in the app.',
				type: 'select',
				value: $LocalSettings.voiceGenerator || 'offline',
				default: 'offline',
				options: ['offline', 'elevenlabs'],
				onInput: (e: Event) => {
					$LocalSettings = {
						...$LocalSettings,
						voiceGenerator: (e.target as HTMLInputElement).value as IVoiceGenerator
					};
				}
			},
			{
				name: 'Speak on Tile Tap',
				description: 'When enabled, the app will speak the text when you tap on a tile.',
				type: 'select',
				value: $LocalSettings.speakOnTap ? 'enabled' : 'disabled',
				default: 'enabled',
				options: ['disabled', 'enabled'],
				onInput: (e: Event) => {
					$LocalSettings = {
						...$LocalSettings,
						speakOnTap: (e.target as HTMLInputElement).value === 'enabled'
					};
				}
			},
			{
				name: 'Sentence Builder',
				description: 'When enabled, you will be able to build sentences in the tile grid.',
				type: 'select',
				value: $LocalSettings.sentenceBuilder ? 'enabled' : 'disabled',
				default: 'enabled',
				options: ['disabled', 'enabled'],
				onInput: (e: Event) => {
					$LocalSettings = {
						...$LocalSettings,
						sentenceBuilder: (e.target as HTMLInputElement).value === 'enabled'
					};
				}
			}
		];
	}

	$: {
		if ($searchQuery) {
			const fuse = new Fuse(settings, {
				keys: ['name', 'description']
			});
			searchSettings = fuse.search($searchQuery).map((result) => result.item);
		}
	}
</script>

<SearchBar query={searchQuery} />
{#each $searchQuery ? searchSettings : settings as setting, index}
	<div in:fly={{ delay: index * 100, y: -10 }} class="border-b border-zinc-300 p-2">
		<div class="flex items-center gap-2">
			<p class="">{setting.name}{': '}</p>
			{#if setting.type === 'select' && setting.options}
				<select
					bind:value={setting.value}
					on:input={setting.onInput}
					class="flex-1 rounded-md border border-zinc-300 bg-zinc-200 p-2 outline-none"
				>
					{#each setting.options as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			{/if}
		</div>

		<p class="pt-2 text-sm">
			{setting.description}
			{#if setting.value !== setting.default}
				<button
					on:click={() => {
						// @ts-ignore
						setting.onInput({ target: { value: setting.default } });
					}}
					class="m-2 rounded-md border border-zinc-300 bg-zinc-200 p-1 text-xs"
					><i class="bi bi-arrow-clockwise" /> Reset to default</button
				>
			{/if}
		</p>
	</div>
{/each}
