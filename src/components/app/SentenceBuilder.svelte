<script lang="ts">
	import SynthesisLoader from './SynthesisLoader.svelte';
	import { Sentence, isSynthesizingSpeech } from '$ts/client/stores';
	import { fade, scale } from 'svelte/transition';
	export let speakText: (text: string) => void;

	const getColorClasses = (color: string | undefined): string => {
		if (!color) return '';
		let bgColorClass: string;
		let textColorClass: string;
		let borderColorClass: string;

		bgColorClass =
			color === 'white' ? 'bg-white' : `bg-${color}-${color === 'zinc' ? '50' : '100'}`;
		textColorClass = color === 'white' ? 'text-zinc-950' : `text-${color}-950`;
		borderColorClass = color === 'white' ? 'border-zinc-500' : `border-${color}-500`;

		return `${bgColorClass} ${textColorClass} ${borderColorClass}`;
	};
</script>

<div
	class="p-2 relative bg-zinc-50 min-h-[100px] border-b border-zinc-200 flex items-center gap-2 rounded-md overflow-hidden"
>
	{#if $isSynthesizingSpeech}
		<div
			in:fade
			class="absolute z-20 top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-full grid place-items-center"
		>
			<div in:scale>
				<SynthesisLoader />
			</div>
		</div>
	{/if}
	<div class="flex items-center h-full overflow-x-auto flex-1 gap-2">
		{#each $Sentence as tile, index}
			<button
				on:click={() => {
					$Sentence = $Sentence.filter((_, i) => i !== index);
				}}
				transition:scale={{ duration: 100 }}
				class={`p-1 min-w-[100px] w-fit h-[70px] border ${getColorClasses(
					tile.color
				)} rounded-md flex flex-col items-center overflow-hidden ${
					!tile.image ? 'justify-center' : ''
				}`}
			>
				<p class="text-ellipsis py-1 text-sm">{tile.displayText || tile.text}</p>
				{#if tile.image}
					<div class="flex-1 w-full relative">
						<img src={tile.image} class="absolute w-full h-full object-contain" alt="Tile media" />
					</div>
				{/if}
			</button>
		{/each}
	</div>
	<div class="flex items-center h-full gap-2">
		<button
			on:click={() => speakText($Sentence.map((tile) => tile.text).join(' '))}
			class="p-2 px-4 bg-blue-500 rounded-md text-blue-50"
		>
			<i class="text-2xl bi bi-volume-up-fill" />
			<p class="text-sm">Speak</p>
		</button>
		<button on:click={() => ($Sentence = [])} class="p-2 px-4 bg-red-500 rounded-md text-blue-50">
			<i class="text-2xl bi bi-trash-fill" />
			<p class="text-sm">Clear</p>
		</button>
	</div>
</div>
