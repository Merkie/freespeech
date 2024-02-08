<script lang="ts">
	import {
		TileBeingEdited,
		LocalSettings,
		EditingTiles,
		UnsavedChanges,
		DiscardUnsavedChangesHandler,
		UnsavedChangesModalOpen,
		UsingOnlineSearch
	} from '$ts/client/stores';
	import type { Tile } from '@prisma/client';

	import { getContext } from 'svelte';

	export let tile: Tile;
	export let speakText: (text: string) => void;

	const handleInteraction = () => {
		if ($EditingTiles) {
			if (!$UnsavedChanges) {
				$UsingOnlineSearch = false;
				$TileBeingEdited = { ...tile };
			} else {
				$DiscardUnsavedChangesHandler = () => {
					$UsingOnlineSearch = false;
					$TileBeingEdited = { ...tile };
				};
				$UnsavedChangesModalOpen = true;
			}
		} else {
			if ($LocalSettings.speakOnTap) {
				speakText(tile.text);
			}
		}
	};

	// Define variables for the background color, text color, and border color
	let bgColorClass: string;
	let textColorClass: string;
	let borderColorClass: string;

	$: {
		bgColorClass =
			tile.color === 'white'
				? 'bg-white'
				: `bg-${tile.color}-${tile.color === 'zinc' ? '50' : '100'}`;
		textColorClass = tile.color === 'white' ? 'text-zinc-950' : `text-${tile.color}-950`;
		borderColorClass = tile.color === 'white' ? 'border-zinc-500' : `border-${tile.color}-500`;
	}
</script>

<div class="relative h-full w-full">
	<button
		on:click={handleInteraction}
		class={`absolute left-0 top-0 h-full w-full overflow-hidden border ${bgColorClass} ${textColorClass} ${borderColorClass} rounded-md ${
			tile.image ? 'flex flex-col items-center' : 'grid place-items-center'
		}`}
	>
		<p class={`text-ellipsis break-all ${!tile.image ? 'text-[2vw]' : 'py-2'}`}>
			{tile.displayText || tile.text}
		</p>
		{#if tile.image}
			<div class="relative w-full flex-1">
				<img src={tile.image} class="absolute h-full w-full object-contain" alt="Tile media" />
			</div>
		{/if}
	</button>
	{#if tile.navigation}
		<div
			class={`absolute -top-1 left-0 h-[10px] rounded-t-md border border-b-0 ${bgColorClass} ${textColorClass} ${borderColorClass} w-[50%]`}
		/>
	{/if}
</div>
