<script lang="ts">
	import Speak from '$ts/client/speak';
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
	import { getContext } from 'svelte';

	export let tile: Tile;

	const ELEVEN_LABS_ENDPOINT = getContext('ELEVEN_LABS_ENDPOINT');

	const handleInteraction = async () => {
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
			if ($LocalSettings.sentenceBuilder && !tile.navigation) {
				$Sentence = [...$Sentence, tile];
			}
			if ($LocalSettings.speakOnTap) {
				await Speak({
					settings: $LocalSettings,
					text: tile.text,
					elevenlabsEndpoint: ELEVEN_LABS_ENDPOINT + ''
				});
			}
		}
	};
</script>

<div
	class={`relative h-full w-full transition-opacity ${$EditingTiles && $TileBeingEdited && $TileBeingEdited.id !== tile.id ? 'opacity-40' : ''}`}
>
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
