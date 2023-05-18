<script lang="ts">
	import { LocalSettings } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import elevenLabsVoices from '$ts/common/ElevenLabsVoices';
	import { fly } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import type { IElevenLabsVoice, IVoiceGenerator } from '$ts/common/types';

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
	let searchQuery = '';
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
			}
		];
	}

	$: {
		if (searchQuery) {
			const fuse = new Fuse(settings, {
				keys: ['name', 'description']
			});
			searchSettings = fuse.search(searchQuery).map((result) => result.item);
		}
	}
</script>

<div class="p-2 border-b border-zinc-700 mb-2">
	<div
		class="px-2 p-1 text-sm border bg-zinc-800 border-zinc-700 flex-1 rounded-md items-center flex gap-2"
	>
		<i class="bi bi-search" />
		<input
			bind:value={searchQuery}
			placeholder="Search settings..."
			type="text"
			class="flex-1 outline-none bg-transparent"
		/>
	</div>
</div>
{#each searchQuery ? searchSettings : settings as setting, index}
	<div in:fly={{ delay: index * 100, y: -10 }} class="p-2 border-b border-zinc-700">
		<div class="flex gap-2 items-center">
			<p class="">{setting.name}{': '}</p>
			{#if setting.type === 'select' && setting.options}
				<select
					bind:value={setting.value}
					on:input={setting.onInput}
					class="p-2 rounded-md border border-zinc-700 bg-zinc-800 flex-1 outline-none"
				>
					{#each setting.options as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			{/if}
		</div>

		<p class="text-sm text-zinc-400 pt-2">
			{setting.description}
			{#if setting.value !== setting.default}
				<button
					on:click={() => {
						// @ts-ignore
						setting.onInput({ target: { value: setting.default } });
					}}
					class="bg-zinc-800 border border-zinc-700 text-xs rounded-md p-1 m-2"
					><i class="bi bi-arrow-clockwise" /> Reset to default</button
				>
			{/if}
		</p>
	</div>
{/each}
