<script lang="ts">
	import { CurrentUser, CurrentProject } from '$lib/stores';
	import { onMount } from 'svelte';
	let settings: {
		text: string;
		description: string;
		type: string;
		default: any;
		options?: any[];
	}[] = [
		{
			text: 'render images as base64',
			description:
				'This will render images as base64 instead of a link to the image, disabling may increase preformace but it will prevent images from displaying in thumbnails.',
			type: 'checkbox',
			default: true
		},
		{
			text: 'display images in the multiply blend mode',
			description:
				'This will display tile images in the multiply blend mode which will remove any white backgrounds from images.',
			type: 'checkbox',
			default: true
		}
	];

	onMount(() => {
		settings = [
			...settings,
			{
				text: 'offline voice',
				description:
					"This is the offline voice the app will use to read out your sentences. Voices are sourced from your device's browser.",
				type: 'select',
				// use the browser's speechSynthesis API to get the voices
				options: speechSynthesis.getVoices().map((voice) => voice.name + ' ' + voice.lang),
				default: 0
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
			<div class="flex items-center bg-zinc-700 p-2 rounded-md">
				<p class="text-lg flex flex-col">
					<span class="capitalize">{setting.text}</span>
					<span class="text-zinc-400 text-sm">{setting.description}</span>
				</p>
				<span class="flex-1" />
				{#if setting.type === 'checkbox'}
					<input checked={setting.default} type="checkbox" name="" id="" />
				{/if}
				{#if setting.type === 'select' && setting.options}
					<select class="bg-zinc-200 p-2 border border-bg-zinc-400 rounded-md text-zinc-500">
						{#each setting.options as option, i}
							<option selected={i === setting.default} value={i}>{option}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
	</div>
</main>
