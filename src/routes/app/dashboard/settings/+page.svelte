<script lang="ts">
	import {
		OfflineVoice,
		ElevenLabsVoice,
		VoiceGenerator,
		SpeakOnTap,
		type VoiceGeneratorOption
	} from '$ts/client/stores';
	import { onMount } from 'svelte';
	import elevenLabsVoices from '$ts/types/ElevenLabsVoices';
	import { fly } from 'svelte/transition';

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
	let containerHeight: number;

	onMount(async () => {
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
				name: 'Voice',
				description: `The offline voice is generated on your device without the need for an internet connection, however you are limited to what is natively supported on your device's browser.`,
				type: 'select',
				value: $OfflineVoice,
				default: offlineBrowserVoices[0],
				options: offlineBrowserVoices,
				onInput: (e: Event) => {
					$OfflineVoice = (e.target as HTMLInputElement).value;
				}
			},
			{
				name: 'ElevenLabs Voice',
				description:
					'ElevenLabs voices are advanced AI-generated voices that sound extremely realistic. These voices are generated on a remote server and require an internet connection. For more information visit ElevenLabs.io',
				type: 'select',
				value: $ElevenLabsVoice,
				default: elevenLabsVoices.map((voice) => voice.name)[0],
				options: elevenLabsVoices.map((voice) => voice.name),
				onInput: (e: Event) => {
					$ElevenLabsVoice = (e.target as HTMLInputElement).value;
				}
			},
			{
				name: 'Voice Generator',
				description: 'This decides with generator to use when generating voices in the app.',
				type: 'select',
				value: $VoiceGenerator,
				default: 'offline',
				options: ['offline', 'elevenlabs'],
				onInput: (e: Event) => {
					$VoiceGenerator = (e.target as HTMLInputElement).value as VoiceGeneratorOption;
				}
			},
			{
				name: 'Speak on Tile Tap',
				description: 'When enabled, the app will speak the text when you tap on a tile.',
				type: 'select',
				value: $SpeakOnTap ? 'enabled' : 'disabled',
				default: 'disabled',
				options: ['disabled', 'enabled'],
				onInput: (e: Event) => {
					$SpeakOnTap = (e.target as HTMLInputElement).value === 'enabled';
				}
			}
		];
	}
</script>

<div class="flex items-center">
	<p class="text-3xl">Application Settings:</p>
</div>
<div bind:clientHeight={containerHeight} class="flex-1 mt-4">
	{#if containerHeight}
		<div
			class="absolute w-full bg-zinc-900 rounded-md border border-zinc-700"
			style={`height: ${containerHeight}px; max-height: ${containerHeight}px; overflow-y: auto;`}
		>
			{#each settings as setting, index}
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
								>Reset to default</button
							>
						{/if}
					</p>
				</div>
			{/each}
		</div>
	{/if}
	<!-- <div
		class="bg-zinc-100 rounded-md border border-zinc-200 text-zinc-500 font-normal flex items-center"
	>
		<i class="bi bi-search p-2" />
		<input
			type="text"
			placeholder="Search settings..."
			class="p-2 rounded-md border-none bg-transparent flex-1 outline-none"
		/>
	</div> -->
</div>
