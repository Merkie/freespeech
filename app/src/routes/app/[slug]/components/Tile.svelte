<script lang="ts">
	import type { Tile } from '@prisma/client';
	export let tile: Tile;
	export let isEditingInspect: boolean;
	export let isEditing: boolean;
	export let inspectorCallback: Function;
	export let navigateCallback: Function;

	const handleInteraction = () => {
		if(isEditing) {
			if(isEditingInspect) {
				inspectorCallback(tile);
				return; // return to prevent the tile from being interracted with
			}
		} else {
			if(tile.navigation) {
				navigateCallback(tile.navigation);
			}
		}
		
		
		
		
		// get the speak text with tile.speak having first priority
		const speak_text = tile.speak || tile.display;
		// speak the text
		var utterance = new SpeechSynthesisUtterance(speak_text);
		window.speechSynthesis.speak(utterance);
	};
</script>

<button on:click={handleInteraction}>
	{#if tile.image}
		<img src={tile.image} width="50px;" alt="icon" />
	{/if}
	<p>{tile.display}</p>
</button>

<style>
	button {
		width: 100%;
		height: 100px;
		background-color: var(--surface-2);
		border: 1px solid var(--surface-4);
		color: var(--text);
		padding: 5px;
		border-radius: 5px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}
</style>
