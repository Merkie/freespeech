<script lang="ts">
	import {
		TileBeingEdited,
		LocalSettings,
		EditingTiles,
		UnsavedChanges,
		DiscardUnsavedChangesHandler,
		UnsavedChangesModalOpen,
		UsingOnlineSearch,
		Sentence
	} from '$ts/client/stores';
	import type { Tile } from '@prisma/client';

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
			if ($LocalSettings.sentenceBuilder && !tile.navigation) {
				$Sentence = [...$Sentence, tile];
			}
		}
	};
</script>

<div class="relative h-full w-full">
	<button
		on:click={handleInteraction}
		style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};`}
		class={`absolute left-0 top-0 h-full w-full overflow-hidden rounded-md border ${
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
			style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};`}
			class={`absolute -top-1 left-0 h-[10px] w-[50%] rounded-t-md border border-b-0`}
		/>
	{/if}
</div>
