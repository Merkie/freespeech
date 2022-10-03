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
					ProjectData,
					UserTileSize,
					UserFontSize
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
		if(!tile.silent && !tile.invisible) {
			// Add to sentence
			$AppSentence = [...$AppSentence, tile]
			var utterance = new SpeechSynthesisUtterance(speak_text);
			window.speechSynthesis.speak(utterance);
		}
	};
</script>

<button style={`background: ${tile.backgroundColor || 'auto'};
								border-color: ${tile.borderColor || 'auto'};
								opacity: ${tile.invisible ? 0 : 1};
								justify-content: ${tile.image ? 'space-between' : 'center'};
								height: ${$UserTileSize}px;
								font-size: ${$UserFontSize}px;`}
							on:click={handleInteraction}>
	{#if tile.navigation}
		<div style={`background: ${tile.backgroundColor || 'auto'}; border-color: ${tile.borderColor || 'auto'}; opacity: ${tile.invisible ? 0 : 1}`} />
	{/if}
	<p style={"font-size: "+(!tile.image && tile.display.length < 10 ? ($UserTileSize/2).toString()+'px' : 'inherit')}>{tile.display}</p>
	{#if tile.image}
		<img src={tile.image} alt="icon" />
	{/if}
</button>

<style>
	img {
		max-height: 60%;
		max-width: 50%;
	}
	button {
		position: relative;
		width: 100%;
		background-color: var(--tile-background);
		border: 2px solid var(--tile-border);
		color: var(--tile-text-color);
		padding: 5px;
		border-radius: 5px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		font-size: 20px;
	}

	div {
		width: 30%;
		height: 10px;
		position: absolute;
		top: -5px;
		left: -2px;
		background-color: var(--tile-background);
		border: 2px solid var(--tile-border);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom: none;
		border-right: none;
	}
</style>
