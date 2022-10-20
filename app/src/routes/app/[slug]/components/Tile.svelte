<script lang="ts">
	// Needed to mess with user selection
	import '$app/environment';

	// Trpc
	import trpc from '$lib/client/trpc';

	// Stores
	import {
		EditorTool,
		EditorTools,
		InEditMode,
		AppProject,
		CurrentPageId,
		NavigationTile,
		SelectedColor,
		SelectedColorMode,
		PageHistory,
		Sentence,
		SwappedTile,
		EditTextMode,
		EditedTiles,
		ConjugatingTile,
		TemplatingPageId,
		PageHistoryIndex
	} from '$lib/client/stores';

	// Helpers
	import { blobToBase64 } from '$lib/client/ClientLogic';

	// Types
	import type { Tile } from '@prisma/client';

	// Props
	export let tile: Tile; // the tile to be rendered
	export let dummy: boolean = false; // if the tile is a "dummy" or non-interactable tile

	// State
	let editing_tile_text = false; // if the user is editing the tile text, controls contenteditable property
	let loading = false; // loading state

	// bindings
	let tile_text_element: HTMLParagraphElement;
	let file_input: HTMLInputElement;

	// tile constants used for logic
	const current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
	const tile_index = $AppProject.pages[current_page_index].tiles.findIndex((t) => t.id === tile.id);
	const all_tiles = $AppProject.pages.flatMap((page) => page.tiles);

	// Handles all tile modifications from edit mode
	const modify_tile = (edited_tile: any) => {
		let edited_tile_index;

		// if we specify an id, we have to find the index of that tile
		if (edited_tile.id) {
			edited_tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
				(t) => t.id === edited_tile.id
			);
		} else {
			edited_tile_index = tile_index;
		}

		// change tile locally
		$AppProject.pages[current_page_index].tiles[edited_tile_index] = {
			...$AppProject.pages[current_page_index].tiles[tile_index],
			...edited_tile
		};
		// add to edited tiles to queue for server
		if (!$EditedTiles.includes($AppProject.pages[current_page_index].tiles[edited_tile_index].id)) {
			$EditedTiles = [
				...$EditedTiles,
				$AppProject.pages[current_page_index].tiles[edited_tile_index].id
			];
		}
	};
	// Handles uploading a tile image to the server, updates the tile as well
	const handle_upload = async (file: File) => {
		loading = true;
		var reader = new FileReader(); // Make reader
		reader.readAsArrayBuffer(file); // Read file as array buffer

		// wait for reader to be done
		await new Promise<void>((resolve) => {
			reader.onload = () => {
				resolve();
			};
		});

		const blob = new Blob([reader.result || '']); // Convert to blob
		const base64 = await blobToBase64(blob); // Convert to base64

		// get the url back from the server
		const url = await trpc(fetch).mutation('s3:upload', {
			file: JSON.stringify({ blob: base64 }),
			filename: file.name
		});
		// modify tile
		if (url) {
			modify_tile({ image: url });
		}
		// bring the user out of loading state
		loading = false;
	};
	// Finds the root navigation of a linked tile
	const find_root_navigation = (cursor_tile: Tile): Tile => {
		if (cursor_tile.link_id) {
			const link_tile = all_tiles.find((tile) => tile.id === cursor_tile.link_id);
			if (link_tile) {
				return find_root_navigation(link_tile);
			} else {
				return cursor_tile;
			}
		} else {
			return cursor_tile;
		}
	};
	// Handles the interraction of a tile
	const handle_interaction = async (e: MouseEvent) => {
		// This prevents a few glitches that can occur with random interractions
		if (e.clientX === 0 && e.clientY === 0) return;

		// If the user is in edit mode
		if ($InEditMode) {
			loading = true;
			switch ($EditorTool) {
				case EditorTools.text: {
					editing_tile_text = true;
					// Wait 10 miliseconds for the element to be rendered
					await new Promise((resolve) => setTimeout(resolve, 10));
					tile_text_element.focus();
					window.getSelection()?.selectAllChildren(tile_text_element);
					break;
				}
				case EditorTools.image: {
					if (tile.image) {
						modify_tile({ image: '' });
					} else {
						file_input.click();
					}
					break;
				}
				case EditorTools.color: {
					var opts: any = {};
					opts[`${$SelectedColorMode}_color`] = $SelectedColor;
					modify_tile(opts);
					break;
				}
				case EditorTools.swap: {
					// If we haven't selected a tile to swap with, select this one
					if (!$SwappedTile) {
						$SwappedTile = tile;
						return;
					}
					// Get the index of the tile we are wanting to swap with
					const swap_tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
						(t) => t.id === $SwappedTile?.id
					);

					// modify first tile
					modify_tile({
						...$AppProject.pages[current_page_index].tiles[swap_tile_index],
						...$AppProject.pages[current_page_index].tiles[tile_index],
						id: $AppProject.pages[current_page_index].tiles[swap_tile_index].id,
						tile_index: $AppProject.pages[current_page_index].tiles[swap_tile_index].tile_index
					});

					// modify the second tile
					modify_tile({
						...$AppProject.pages[current_page_index].tiles[tile_index],
						...$SwappedTile,
						id: $AppProject.pages[current_page_index].tiles[tile_index].id,
						tile_index: $AppProject.pages[current_page_index].tiles[tile_index].tile_index
					});

					// set swapped tile to null
					$SwappedTile = null;
					break;
				}
				case EditorTools.accent:
					modify_tile({ is_accented: !tile.is_accented });
					break;
				case EditorTools.invisible:
					modify_tile({ is_invisible: !tile.is_invisible });
					break;
				case EditorTools.silent:
					modify_tile({ is_silent: !tile.is_silent });
					break;
				case EditorTools.navigate:
					$NavigationTile = tile;
					break;
				case EditorTools.template: {
					// remove the link if the user has one already
					if (tile.link_id) {
						modify_tile({ link_id: '' });
						return;
					}

					// get the index of the page we're templating from
					const templating_page_index = $AppProject.pages.findIndex(
						(t) => t.id === $TemplatingPageId
					);

					// find the tile
					const templating_tile = $AppProject.pages[templating_page_index].tiles[tile_index];
					if (!templating_tile) return null;

					// root tile
					const templating_root_tile = find_root_navigation(templating_tile);

					// Modify the tile to have the updated link
					modify_tile({
						...$AppProject.pages[current_page_index].tiles[tile_index],
						...templating_root_tile,
						tilePageId: $AppProject.pages[current_page_index].tiles[tile_index].tilePageId,
						link_id: templating_root_tile.id,
						tile_index: $AppProject.pages[current_page_index].tiles[tile_index].tile_index,
						id: $AppProject.pages[current_page_index].tiles[tile_index].id
					});
					break;
				}
				case EditorTools.trash: {
					$AppProject.pages[current_page_index].tiles = $AppProject.pages[
						current_page_index
					].tiles.filter((t) => t.id !== tile.id);
					await trpc(fetch).mutation('tile:remove', { id: tile.id });
					break;
				}
			}
			loading = false;
		} else {
			if (tile.navigation_page_id) {
				// Trigger a navigation
				$CurrentPageId = tile.navigation_page_id as number;
				$PageHistory = [$CurrentPageId, ...$PageHistory];
				// remove the unneeded history
				$PageHistory = $PageHistory.slice($PageHistoryIndex, $PageHistory.length);
				$PageHistoryIndex = 0;
			} else {
				// if the tile is silent, just return
				if (tile.is_silent) return;
				// add the tile to the sentence
				$Sentence = [...$Sentence, tile];
			}
		}
	};
	// Handles opening the conjugation window
	const handle_conjugation = () => {
		if ($InEditMode) return;
		if (tile.speak_text?.includes('+')) return;
		$Sentence = $Sentence.slice(0, -2);
		$ConjugatingTile = tile;
	};
	// Called on input when the user is editing the tile's text
	const edit_tile = async () => {
		if ($EditTextMode === 'display') {
			modify_tile({
				display_text: tile_text_element.innerText
			});
		} else {
			modify_tile({
				speak_text: tile_text_element.innerText
			});
		}
	};
</script>

<button
	style={`
	opacity: ${tile.is_invisible ? 0 : 1};
	opacity: ${$InEditMode && tile.is_invisible ? 0.25 : 'auto'};
	opacity: ${$InEditMode && tile.link_id ? 0.5 : 'auto'};
	opacity: ${$InEditMode && tile.is_silent ? 0.5 : 'auto'};
	border-color: ${$SwappedTile?.id === tile.id && $InEditMode ? 'var(--primary-300)' : 'auto'};
	transform: ${$SwappedTile?.id === tile.id && $InEditMode ? 'scale(1.2)' : 'auto'};
	z-index: ${$SwappedTile?.id === tile.id && $InEditMode ? 999 : 'auto'};
	${tile.border_color ? '--tiles-border: ' + tile.border_color : ''};
	${tile.background_color ? '--tile-background: ' + tile.background_color : ''};
	color: ${tile.text_color || 'auto'};
	pointer-events: ${tile.is_invisible && !$InEditMode ? 'none' : 'auto'};
	min-height: ${dummy ? '100px' : 'auto'};
	`}
	disabled={loading}
	on:click={handle_interaction}
	on:dblclick={handle_conjugation}
>
	{#if tile.navigation_page_id}
		<div class="folder-bit" />
	{/if}
	<div class="overflow-wrapper">
		{#if tile.is_silent && $InEditMode}
			<div class="silent">
				<i class="bx bxs-volume-mute" />
			</div>
		{/if}

		<input
			type="file"
			bind:this={file_input}
			on:change={() => {
				if (file_input.files) handle_upload(file_input.files[0]);
			}}
			style="display: none;"
		/>

		<div class="tile-content">
			{#if tile.image}
				<img src={tile.image} alt="tile icon" />
			{/if}
			<p
				bind:this={tile_text_element}
				on:input={edit_tile}
				spellcheck="false"
				style={`${!tile.image && (tile.display_text + '').length < 10 ? 'font-size: 2rem;' : ''}
								${!tile.image && (tile.display_text + '').length < 4 ? 'font-size: 4rem;' : ''})}`}
				contenteditable={editing_tile_text && $InEditMode && $EditorTool === EditorTools.text}
			>
				{$EditTextMode === 'speak' && $InEditMode ? tile.speak_text || '...' : tile.display_text}
			</p>
		</div>

		<div
			style={`transform: ${
				tile.is_accented
					? 'rotate(45deg) translate(0%, -90%)'
					: 'rotate(45deg) translate(0%, -120%)'
			};
			background-color: ${tile.border_color || 'auto'};`}
			class="accent"
		/>
		<i style={`opacity: ${$InEditMode && tile.link_id ? '1' : '0'};`} class="bx bx-link" />
	</div>
</button>

<style>
	button {
		position: relative;
		background: var(--tile-background);
		border: 2px solid var(--tiles-border);
		color: var(--tiles-text);
		white-space: pre;
		min-width: 0; /* NEW; needed for Firefox */
		width: 100%;
		height: 100%;
		text-align: center;
	}

	.overflow-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		display: flex;
	}

	.tile-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.tile-content img {
		max-width: min(50%, 50px);
	}

	.tile-content p {
		font-weight: 500;
		font-size: 1.25rem;
		max-width: 100%;
		white-space: normal;
		overflow-wrap: break-word;
	}

	.accent {
		position: absolute;
		top: 0;
		right: 0;
		width: 50px;
		height: 50px;
		transform: rotate(45deg) translate(0%, -90%);
		background-color: var(--tiles-border);
	}
	.folder-bit {
		position: absolute;
		top: -5px;
		left: -2px;
		width: 50%;
		height: 10px;
		border: 2px solid var(--tiles-border);
		border-bottom: none;
		border-right: none;
		border-radius: 5px 5px 0px 0px;
		background: var(--tile-background);
	}

	.bx-link {
		position: absolute;
		bottom: 5px;
		right: 5px;
		font-size: 1.5rem;
		color: var(--tiles-text);
	}

	.silent {
		position: absolute;
		top: 5px;
		left: 5px;
		font-size: 1.5rem;
		color: var(--tiles-text);
	}
</style>
