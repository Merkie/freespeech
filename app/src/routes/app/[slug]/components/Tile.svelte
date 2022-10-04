<script lang="ts">
	// Types
	import type { Tile, TilePage } from '@prisma/client';

	// Icons
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Link1 } from '@steeze-ui/radix-icons';

	// Stores
	import { InspectedTile,
					IsInEditMode,
					IsEditingInspect,
					AppSentence,
					CurrentPageIndex,
					PageHistory,
					ProjectData,
					UserTileSize,
					UserFontSize,
					EditingColor,
					EditingType,
					IsEditingColor,
					EditedTiles,
					IsEditingTrash,
					IsEditingAccent,
					IsEditingInvisible,
					IsEditingTemplate
					} from '$lib/stores';
	import { create_page, remove_tile } from '$lib/api/app';

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

	const add_to_edited_tiles = () => {
		$EditedTiles = $EditedTiles.filter((item) => {
			return item.id !== tile.id;
		});

		// Add it to the list
		$EditedTiles = [...$EditedTiles, tile];
	}

	// Handle interraction with tile
	const handleInteraction = async () => {
		if(dummy) return; // If the tile is a dummy tile, do nothing
		if($IsInEditMode) { // If the user is in edit mode
			if($IsEditingInspect) {
				if(tile.link) return;
				$InspectedTile = tile;
				return; // return to prevent the tile from being interracted with
			}
			if($IsEditingTrash) {
				$ProjectData.pages[$CurrentPageIndex].tiles = $ProjectData.pages[$CurrentPageIndex].tiles.filter((t) => t.id !== tile.id);
				await remove_tile(tile.id, $session?.access_token+'');
				return; // return to prevent the tile from being interracted with
			}
			if($IsEditingAccent) {
				if(tile.link) return;
				tile.accented = !tile.accented;
				add_to_edited_tiles();
				return;
			}
			if($IsEditingInvisible) {
				if(tile.link) return;
				tile.invisible = !tile.invisible;
				add_to_edited_tiles();
				return;
			}
			if($IsEditingTemplate) {
				if(tile.link) {
					tile.link = null;
				} else {
					let parentPage = $ProjectData.pages.find((page) => page.name.toUpperCase() === $PageHistory[1].toUpperCase());
					if(parentPage) {
						let parentTile = (parentPage as TilePage & { tiles: Tile[] } ).tiles.find((parentTile) => parentTile.index === tile.index);
						if(parentTile) {
							tile.link = parentTile.id;
							tile.display = parentTile.display;
							tile.speak = parentTile.speak;
							tile.image = parentTile.image;
							tile.backgroundColor = parentTile.backgroundColor;
							tile.borderColor = parentTile.borderColor;
							tile.textColor = parentTile.textColor;
							tile.accented = parentTile.accented;
							tile.invisible = parentTile.invisible;
							tile.navigation = parentTile.navigation;
						}
					}
				}
				add_to_edited_tiles();
				return;
			}
			if($IsEditingColor) {
				if(tile.link) return;
				if($EditingType === 'background') {
					tile.backgroundColor = $EditingColor;
				} else if($EditingType === 'border') {
					tile.borderColor = $EditingColor;
				} else if($EditingType === 'text') {
					tile.textColor = $EditingColor;
				} else if($EditingType === 'invisible') {
					tile.invisible = !tile.invisible;
				}
				add_to_edited_tiles();
				return;
			}
		} else if(tile.navigation) { // If the user is not in edit mode and the tile has a navigation
			navigate(tile.navigation)
		}

		// get the speak text with tile.speak having first priority
		let speak_text = tile.speak || tile.display;

		// speak the text
		if(!tile.silent && !tile.invisible) {
			// Add to sentence
			if(tile.modifier) {
				const last_tile = $AppSentence[$AppSentence.length-1];
				let last_speak_text = last_tile.speak || last_tile.display;
				if(tile.modifier[0] === '+') {
					speak_text = last_speak_text + tile.modifier.replace('+', '');
				} else if(tile.modifier?.at(tile.modifier.length-1) === '-') {
					speak_text = tile.modifier.replace('-', '') + last_speak_text;
				}
			}
			var utterance = new SpeechSynthesisUtterance(speak_text);
			window.speechSynthesis.speak(utterance);
			$AppSentence = [...$AppSentence, tile]
		}
	};
</script>

<button style={`background: ${tile.backgroundColor || 'auto'};
								border-color: ${tile.borderColor || 'auto'};
								color: ${tile.textColor || 'auto'};
								opacity: ${tile.invisible ? 0 : 1};
								opacity: ${tile.link && $IsInEditMode ? 0.5 : 'auto'};
								justify-content: ${tile.image ? 'space-between' : 'center'};
								height: ${$UserTileSize}px;
								font-size: ${$UserFontSize}px;
								overflow: ${tile.navigation ? 'auto' : 'hidden'};`}
							on:click={handleInteraction}>

	{#if $IsInEditMode && tile.link}
		<div class="link-piece">
			<Icon src={Link1} width="50px" />
		</div>
	{/if}

	{#if tile.navigation}
		<div class="folder-piece" style={`background: ${tile.backgroundColor || 'auto'}; border-color: ${tile.borderColor || 'auto'}; opacity: ${tile.invisible ? 0 : 1}`} />
	{/if}

	{#if tile.accented}
		<div class="corner-piece" style={`background: ${tile.borderColor || 'auto'}; opacity: ${tile.invisible ? 0 : 1}`} />
	{/if}
	
	<p style={"font-size: "+(!tile.image && tile.display.length < 7 ? ($UserTileSize/2).toString()+'px' : 'inherit')}>{tile.display}</p>
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

	.link-piece {
		position: absolute;
		height: 50px;
		width: 50px;
		border-radius: 5px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--tile-background);
		border: 2px solid var(--tile-border);
		opacity: .8;
	}

	.corner-piece {
		width: 40px;
		height: 40px;
		position: absolute;
		top: -27px;
		right: -27px;
		rotate: 45deg;
	}

	.folder-piece {
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
