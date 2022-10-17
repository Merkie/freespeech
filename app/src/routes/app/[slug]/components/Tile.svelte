<script lang="ts">
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
		PageHistoryIndex,
		Sentence,
		SwappedTile,
		EditTextMode,
		EditedTiles
	} from '$lib/client/stores';

	// Helpers
	import { blobToBase64 } from '$lib/client/blob2base64';

	// Types
	import type { Tile } from '@prisma/client';
	import { tick } from 'svelte';

	// Props
	export let tile: Tile;

	// State
	let editingTileText = false;

	// bindings
	let tileTextElement: HTMLParagraphElement;
	let file_input: HTMLInputElement;
	let files: FileList;
	let loading = false;

	let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);

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

		const url = await trpc(fetch).mutation('s3:upload', {
			file: JSON.stringify({ blob: base64 }),
			filename: file.name
		});

		const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => t.id === tile.id
		);
		$AppProject.pages[current_page_index].tiles[tile_index].image = url;
		await trpc(fetch).mutation(
			'tile:edit',
			//@ts-ignore
			$AppProject.pages[current_page_index].tiles[tile_index]
		);
		loading = false;
	};

	//@ts-ignore
	const find_root_navigation = (cursor_tile: Tile) => {
		if (cursor_tile.link_id) {
			const all_tiles = $AppProject.pages.flatMap((page) => page.tiles);
			const link_tile = all_tiles.find((tile) => tile.id === cursor_tile.link_id);
			if (link_tile) {
				console.log(link_tile.display_text);
				return find_root_navigation(link_tile);
			} else {
				return cursor_tile;
			}
		} else {
			return cursor_tile;
		}
	};

	//@ts-ignore
	const handle_interaction = async (e) => {
		if (e.clientX === 0 && e.clientY === 0) return;
		if ($InEditMode) {
			loading = true;
			if ($EditorTool === EditorTools.text) {
				editingTileText = true;
				// Wait 10 miliseconds for the element to be rendered
				await new Promise((resolve) => setTimeout(resolve, 10));
				tileTextElement.focus();
				window.getSelection()?.selectAllChildren(tileTextElement);
			} else if ($EditorTool === EditorTools.image) {
				file_input.click();
			} else if ($EditorTool === EditorTools.color) {
				const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);
				$AppProject.pages[current_page_index].tiles[tile_index][`${$SelectedColorMode}_color`] =
					$SelectedColor;
				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[tile_index]
				);
			} else if ($EditorTool === EditorTools.swap) {
				if (!$SwappedTile) {
					$SwappedTile = tile;
					return;
				}
				// swap tiles
				const current_tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);
				const swap_tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === $SwappedTile?.id
				);

				// swap
				$AppProject.pages[current_page_index].tiles[swap_tile_index] = {
					...$AppProject.pages[current_page_index].tiles[swap_tile_index],
					...$AppProject.pages[current_page_index].tiles[current_tile_index],
					id: $AppProject.pages[current_page_index].tiles[swap_tile_index].id,
					tile_index: $AppProject.pages[current_page_index].tiles[swap_tile_index].tile_index
				};

				// use saved version to update the current tile
				$AppProject.pages[current_page_index].tiles[current_tile_index] = {
					...$AppProject.pages[current_page_index].tiles[current_tile_index],
					...$SwappedTile,
					id: $AppProject.pages[current_page_index].tiles[current_tile_index].id,
					tile_index: $AppProject.pages[current_page_index].tiles[current_tile_index].tile_index
				};

				// set swapped tile to null
				$SwappedTile = null;

				// push both updates to server
				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[swap_tile_index]
				);

				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[current_tile_index]
				);
			} else if ($EditorTool === EditorTools.accent) {
				const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);
				$AppProject.pages[current_page_index].tiles[tile_index].is_accented =
					!$AppProject.pages[current_page_index].tiles[tile_index].is_accented;
				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[tile_index]
				);
			} else if ($EditorTool === EditorTools.invisible) {
				const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);
				$AppProject.pages[current_page_index].tiles[tile_index].is_invisible =
					!$AppProject.pages[current_page_index].tiles[tile_index].is_invisible;
				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[tile_index]
				);
			} else if ($EditorTool === EditorTools.silent) {
				const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);
				$AppProject.pages[current_page_index].tiles[tile_index].is_silent =
					!$AppProject.pages[current_page_index].tiles[tile_index].is_silent;
				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[tile_index]
				);
			} else if ($EditorTool === EditorTools.navigate) {
				$NavigationTile = tile;
			} else if ($EditorTool === EditorTools.template) {
				const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
					(t) => t.id === tile.id
				);

				if ($AppProject.pages[current_page_index].tiles[tile_index].link_id) {
					$AppProject.pages[current_page_index].tiles[tile_index].link_id = null;
				} else {
					const last_page_index = $AppProject.pages.findIndex(
						(t) => t.id === $PageHistory[$PageHistoryIndex + 1]
					);

					let last_tile = $AppProject.pages[last_page_index].tiles[tile_index];
					let root_navigation = find_root_navigation(last_tile);
					let root_navigation_id = root_navigation.id;

					// @ts-ignore
					delete root_navigation.id;
					// @ts-ignore
					delete root_navigation.link_id;

					// Update tile
					$AppProject.pages[current_page_index].tiles[tile_index] = {
						...$AppProject.pages[current_page_index].tiles[tile_index],
						...root_navigation,
						tilePageId: tile.tilePageId,
						link_id: root_navigation_id,
						tile_index: tile.tile_index
					};
				}

				await trpc(fetch).mutation(
					'tile:edit',
					//@ts-ignore
					$AppProject.pages[current_page_index].tiles[tile_index]
				);
			} else if ($EditorTool === EditorTools.trash) {
				$AppProject.pages[current_page_index].tiles = $AppProject.pages[
					current_page_index
				].tiles.filter((t) => t.id !== tile.id);
				await trpc(fetch).mutation('tile:remove', { id: tile.id });
			}
			loading = false;
		} else {
			if (tile.navigation_page_id) {
				$CurrentPageId = tile.navigation_page_id;
				$PageHistory = [$CurrentPageId, ...$PageHistory];
			} else {
				if (tile.is_silent) return;
				$Sentence = [...$Sentence, tile];
			}
		}
	};

	const edit_tile = async () => {
		const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => t.id === tile.id
		);
		if ($EditTextMode === 'display') {
			$AppProject.pages[current_page_index].tiles[tile_index].display_text =
				tileTextElement.innerText;
		} else {
			$AppProject.pages[current_page_index].tiles[tile_index].speak_text =
				tileTextElement.innerText;
		}
		// add to edited tiles
		if (!$EditedTiles.includes(tile.id)) {
			$EditedTiles = [...$EditedTiles, tile.id];
		}
	}

	const save_tile = async () => {
		const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => t.id === tile.id
		);
		if ($EditTextMode === 'display') {
			$AppProject.pages[current_page_index].tiles[tile_index].display_text =
				tileTextElement.innerText;
		} else {
			$AppProject.pages[current_page_index].tiles[tile_index].speak_text =
				tileTextElement.innerText;
		}
		const updated_tile = $AppProject.pages[current_page_index].tiles.find((t) => t.id === tile.id);
		//@ts-ignore
		await trpc(fetch).mutation('tile:edit', updated_tile);
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
	overflow: ${tile.navigation_page_id ? 'visible' : 'hidden'};
	${tile.border_color ? '--tiles-border: ' + tile.border_color : ''};
	${tile.background_color ? '--tile-background: ' + tile.background_color : ''};
	color: ${tile.text_color || 'auto'};
	pointer-events: ${tile.is_invisible && !$InEditMode ? 'none' : 'auto'};
	`}
	disabled={loading}
	on:click={handle_interaction}
>
	{#if tile.navigation_page_id}
		<div class="folder-bit" />
	{/if}

	{#if tile.is_silent && $InEditMode}
		<div class="silent">
			<i class="bx bxs-volume-mute" />
		</div>
	{/if}

	{#if tile.image}
		<img src={tile.image} alt="tile icon" />
	{/if}

	<input
		type="file"
		bind:this={file_input}
		bind:files
		on:change={() => handle_upload(files[0])}
		style="display: none;"
	/>
	<p
		bind:this={tileTextElement}
		on:input={edit_tile}
		spellcheck="false"
		contenteditable={editingTileText && $InEditMode && $EditorTool === EditorTools.text}
		style={`
		bottom: ${tile.image ? '7%' : '50%'};
		transform: ${tile.image ? 'auto' : 'translate(-50%, 50%)'};
		font-size: ${tile.image ? '1.2rem' : '1.5rem'};
		`}
	>
		{$EditTextMode === 'speak' && $InEditMode ? tile.speak_text || '...' : tile.display_text}
	</p>
	{#if !tile.navigation_page_id}
		<div
			style={`transform: ${
				tile.is_accented
					? 'rotate(45deg) translate(0%, -90%)'
					: 'rotate(45deg) translate(0%, -120%)'
			};
			background-color: ${tile.border_color || 'auto'};`}
			class="accent"
		/>
	{/if}
	<i style={`opacity: ${$InEditMode && tile.link_id ? '1' : '0'};`} class="bx bx-link" />
</button>

<style>
	button {
		position: relative;
		background: var(--tile-background);
		border: 2px solid var(--tiles-border);
		color: var(--tiles-text);
		font-size: 2rem;
		white-space: pre;
		min-width: 0; /* NEW; needed for Firefox */
		width: 100%;
		height: 100%;
		text-align: center;
	}

	button * {
		position: absolute;
	}

	img {
		left: 50%;
		transform: translateX(-50%);
		top: 10px;
		height: 60%;
		width: auto;
		object-fit: contain;
	}

	p {
		font-size: 18px;
		left: 50%;
		transform: translateX(-50%);
		overflow-wrap: anywhere;
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
