<script lang="ts">
	import { CurrentUser, CurrentProject, ApplicationSettings } from '$lib/stores';
	import { onMount } from 'svelte';
	let settings: {
		text: string;
		description: string;
		type: string;
		default: any;
		value: any;
		options?: any[];
		onChange: (e: any) => void;
	}[] = [
		{
			text: 'render images as base64',
			description:
				'This will render images as base64 instead of a link to the image, disabling may increase preformace but it will prevent images from displaying in thumbnails.',
			type: 'checkbox',
			default: true,
			value: $ApplicationSettings.renderImagesAsBase64,
			onChange: (e) => {
				$ApplicationSettings = {
					...$ApplicationSettings,
					renderImagesAsBase64: e.target.checked
				};
			}
		},
		{
			text: 'display images in the multiply blend mode',
			description:
				'This will display tile images in the multiply blend mode which will remove any white backgrounds from images.',
			type: 'checkbox',
			default: true,
			value: $ApplicationSettings.displayImagesInMixMode,
			onChange: (e) => {
				$ApplicationSettings = {
					...$ApplicationSettings,
					displayImagesInMixMode: e.target.checked
				};
			}
		}
	];

	onMount(async () => {
		settings = [
			...settings,
			{
				text: 'offline voice',
				description:
					"This is the offline voice the app will use to read out your sentences. Voices are sourced from your device's browser.",
				type: 'select',
				// use the browser's speechSynthesis API to get the voices
				options: speechSynthesis.getVoices().map((voice) => voice.name + ' ' + voice.lang),
				default: 0,
				value: $ApplicationSettings.offlineVoiceIndex || 0,
				onChange: (e) => {
					$ApplicationSettings = {
						...$ApplicationSettings,
						offlineVoiceIndex: parseInt(e.target.value + '')
					};
				}
			},
			{
				text: 'cloud voice',
				description:
					'These voices are higher quality but they can only be used while connected to the internet.',
				type: 'select',
				default: 0,
				options: (await (await fetch('https://tts.gay/api/v1/list')).json()).voices.map(
					(voice) => voice.name + ' ' + voice.languageCode
				),
				value: 0,
				onChange: (e) => null
			}
		];
	});
</script>

<main class="p-8 py-4 text-zinc-200">
	<div class="flex gap-4 mb-4 items-center">
		<p class="text-2xl">Application Settings{' '}</p>
		<div class="flex-1" />
	</div>
	<div class="w-full flex flex-col gap-2">
		<input
			placeholder="Search settings..."
			type="text"
			class="bg-zinc-200 p-2 border border-bg-zinc-400 rounded-md text-zinc-500 mb-8"
		/>
		{#each settings as setting}
			<div class="flex items-center bg-zinc-700 p-2 rounded-md border border-zinc-600">
				<p class="text-lg flex flex-col">
					<span class="capitalize">{setting.text}</span>
					<span class="text-zinc-400 text-sm">{setting.description}</span>
				</p>
				<span class="flex-1" />
				{#if setting.value !== setting.default}
					<button
						on:click={() => {
							setting.value = setting.default;
							setting.onChange({ target: { checked: setting.default, value: setting.default } });
						}}
						class="mr-2 p-1 px-2 rounded-md text-sm text-zinc-400 bg-zinc-800"
						>Restore default setting</button
					>
				{/if}
				{#if setting.type === 'checkbox'}
					<input
						on:input={(e) => {
							// @ts-ignore
							setting.value = e.target.checked;
							setting.onChange(e);
						}}
						checked={setting.value}
						type="checkbox"
						name=""
						id=""
					/>
				{/if}
				{#if setting.type === 'select' && setting.options}
					<select
						on:input={(e) => {
							// @ts-ignore
							setting.value = parseInt(e.target.value + '');
							setting.onChange(e);
						}}
						value={setting.value}
						class="bg-zinc-200 p-2 border border-bg-zinc-400 rounded-md text-zinc-500"
					>
						{#each setting.options as option, i}
							<option selected={i === setting.default} value={i}>{option}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
	</div>
</main>
