<script lang="ts">
	import SynthesisLoader from './SynthesisLoader.svelte';
	import { Sentence, isSynthesizingSpeech } from '$ts/client/stores';
	import { fade, scale } from 'svelte/transition';
	export let speakText: (text: string) => void;
</script>

<div
	class="relative flex min-h-[100px] items-center gap-2 overflow-hidden rounded-md border-b border-zinc-200 bg-zinc-50 p-2"
>
	{#if $isSynthesizingSpeech}
		<div
			in:fade
			class="absolute left-0 top-0 z-20 grid h-full w-full place-items-center bg-[rgba(0,0,0,0.5)]"
		>
			<div in:scale>
				<SynthesisLoader />
			</div>
		</div>
	{/if}
	<div class="flex h-full flex-1 items-center gap-2 overflow-x-auto">
		{#each $Sentence as tile, index}
			<button
				on:click={() => {
					$Sentence = $Sentence.filter((_, i) => i !== index);
				}}
				transition:scale={{ duration: 100 }}
				style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};`}
				class={`flex h-[70px] w-fit min-w-[100px] flex-col items-center overflow-hidden rounded-md border p-1 ${
					!tile.image ? 'justify-center' : ''
				}`}
			>
				<p class="text-ellipsis py-1 text-sm">{tile.displayText || tile.text}</p>
				{#if tile.image}
					<div class="relative w-full flex-1">
						<img src={tile.image} class="absolute h-full w-full object-contain" alt="Tile media" />
					</div>
				{/if}
			</button>
		{/each}
	</div>
	<div class="flex h-full items-center gap-2">
		<button
			on:click={() => speakText($Sentence.map((tile) => tile.text).join(' '))}
			class="grid h-[80px] w-[80px] place-items-center rounded-md bg-blue-500 text-blue-50"
		>
			<i class="bi bi-volume-up-fill text-4xl" />
			<!-- <p class="text-sm">Speak</p> -->
		</button>
		<button
			on:click={() => ($Sentence = [])}
			class="grid h-[80px] w-[80px] place-items-center rounded-md bg-red-500 text-blue-50"
		>
			<i class="bi bi-trash-fill text-4xl" />
			<!-- <p class="text-sm">Clear</p> -->
		</button>
	</div>
</div>
