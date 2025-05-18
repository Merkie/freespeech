<script lang="ts">
	import { speakText } from '$ts/client/speak';
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
	import type { Tile } from '$ts/common/types';

	export let tile: Tile;
	export let noInteraction = false;

	let tileTextContainerHeight = 0;

	const handleInteraction = () => {
		if ($EditingTiles) {
			// deselect tile
			if ($TileBeingEdited && $TileBeingEdited.id === tile.id) return ($TileBeingEdited = null);

			if (!$UnsavedChanges) {
				// reset state
				$UsingOnlineSearch = false;
				$TileBeingEdited = { ...tile };
			} else {
				// handle unsaved changes
				$DiscardUnsavedChangesHandler = () => {
					$UsingOnlineSearch = false;
					$TileBeingEdited = { ...tile };
				};

				// open modal
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

<div
	class={`group relative h-full w-full transition-opacity ${$EditingTiles && $TileBeingEdited && $TileBeingEdited.id !== tile.id ? 'opacity-40' : ''}`}
>
	<button
		on:click={noInteraction ? null : handleInteraction}
		style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};${tile.image ? ' grid-template-rows: 25% 75%;' : ''}`}
		class={`absolute left-0 top-0 h-full w-full overflow-hidden rounded-md border ${
			tile.image ? 'grid grid-cols-1 grid-rows-2' : 'grid place-items-center'
		}`}
	>
		{#if tile.image}
			<div bind:clientHeight={tileTextContainerHeight} class="relative h-full w-full">
				<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center">
					<p
						style={`font-size: ${Math.max(3, Math.floor(tileTextContainerHeight * 0.7))}px;`}
						class="flex-1 truncate px-2 text-center"
					>
						{tile.displayText || tile.text}
					</p>
				</div>
			</div>

			<img src={tile.image} class="h-full w-full object-contain" alt="Tile media" />
		{:else}
			<p class={`w-full truncate ${!tile.image ? 'text-[2vw]' : 'py-2'}`}>
				{tile.displayText || tile.text}
			</p>
		{/if}
	</button>
	{#if tile.navigation}
		<div
			style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};`}
			class={`absolute -top-1 left-0 h-[10px] w-[50%] rounded-t-md border border-b-0 brightness-100 group-hover:brightness-105 group-active:brightness-100`}
		/>
	{/if}
</div>
