<script lang="ts">
	// Types
	import type { Tile } from '@prisma/client';
	
	// Stores
	import { InspectedTile,
					IsInEditMode,
					IsEditingInspect,
					AppSentence,
					CurrentPageIndex,
					PageHistory,
					ProjectData
					} from '$lib/stores';
	import { create_page } from '$lib/api/app';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();

	// Props
	export let tile: Tile;
	export let dummy: boolean = false;
	
	// Navigate to another page 
	const navigate = async (navigation: string) => {
		// get new Index
		let newIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === navigation.toUpperCase());

		// Checking to see if the page exists, if it doesnt we have to create one
		if (newIndex !== -1) {
			// If it does exist just set the currentPageIndex to the new index
			$CurrentPageIndex = newIndex;

			// Add the page to the pageHistory
			$PageHistory = [$ProjectData.pages[$CurrentPageIndex].name, ...$PageHistory];
		} else { 
			// If it doesnt exist we have to create a new page

			// Send create_page request to the server
			const response = await create_page($ProjectData.id, navigation, $session?.access_token+'');
		if (!response.page) return;
		
			// Add the page to ProjectData
			$ProjectData.pages = [...$ProjectData.pages, response.page];
		
			// Set the currentPageIndex to the new index
			$CurrentPageIndex = $ProjectData.pages.length - 1;

			// Add the page to the pageHistory
			$PageHistory = [$ProjectData.pages[$CurrentPageIndex].name, ...$PageHistory];
		}
	};

	// Handle interraction with tile
	const handleInteraction = () => {
		if(dummy) return;
		if($IsInEditMode) {
			if($IsEditingInspect) {
				$InspectedTile = tile;
				return; // return to prevent the tile from being interracted with
			}
		} else {
			if(tile.navigation) {
				navigate(tile.navigation)
			}
		}

		// get the speak text with tile.speak having first priority
		const speak_text = tile.speak || tile.display;

		// speak the text
		if(!tile.silent) {
			// Add to sentence
			$AppSentence = [...$AppSentence, tile]
			var utterance = new SpeechSynthesisUtterance(speak_text);
			window.speechSynthesis.speak(utterance);
		}
	};
</script>

<button style={`background: ${tile.backgroundColor || 'auto'}; border-color: ${tile.borderColor || 'auto'}; opacity: ${tile.invisible ? 0 : 1}`} on:click={handleInteraction}>
	{#if tile.navigation}
		<div style={`background: ${tile.backgroundColor || 'auto'}; border-color: ${tile.borderColor || 'auto'}; opacity: ${tile.invisible ? 0 : 1}`} />
	{/if}
	{#if tile.image}
		<img src={tile.image} width="50px;" alt="icon" />
	{/if}
	<p>{tile.display}</p>
</button>

<style>
	button {
		position: relative;
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

	div {
		width: 30%;
		height: 10px;
		position: absolute;
		top: -5px;
		left: -1px;
		background-color: var(--surface-2);
		border: 1px solid var(--surface-4);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom: none;
		border-right: none;
	}
</style>
