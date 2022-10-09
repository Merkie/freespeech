<script lang="ts">
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
		SelectedColorMode
	} from '$lib/client/stores';

	// Types
	import type { Tile } from '@prisma/client';

	// Props
	export let tile: Tile;

	// State
	let editingTileText = false;

	// bindings
	let tileTextElement: HTMLParagraphElement;

	let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);

	const handle_interaction = async () => {
		if ($InEditMode) {
			if ($EditorTool === EditorTools.text) {
				editingTileText = true;
				// Wait 10 miliseconds for the element to be rendered
				await new Promise((resolve) => setTimeout(resolve, 10));
				tileTextElement.focus();
			} else if ($EditorTool === EditorTools.image) {
			} else if ($EditorTool === EditorTools.move) {
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
			} else if ($EditorTool === EditorTools.navigate) {
				$NavigationTile = tile;
			} else if ($EditorTool === EditorTools.template) {
			} else if ($EditorTool === EditorTools.trash) {
				$AppProject.pages[current_page_index].tiles = $AppProject.pages[
					current_page_index
				].tiles.filter((t) => t.id !== tile.id);
				await trpc(fetch).mutation('tile:remove', { id: tile.id });
			}
		} else {
			if (tile.navigation_page_id) {
				$CurrentPageId = tile.navigation_page_id;
			}
		}
	};

	const save_tile = async () => {
		const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => t.id === tile.id
		);
		$AppProject.pages[current_page_index].tiles[tile_index].display_text =
			tileTextElement.innerText;
		const updated_tile = $AppProject.pages[current_page_index].tiles.find((t) => t.id === tile.id);
		//@ts-ignore
		await trpc(fetch).mutation('tile:edit', updated_tile);
	};
</script>

<button
	style={`
	opacity: ${tile.is_invisible ? 0 : 1};
	opacity: ${$InEditMode && tile.is_invisible ? 0.25 : 'auto'};
	overflow: ${tile.navigation_page_id ? 'visible' : 'hidden'};
	border-color: ${tile.border_color || 'auto'};
	background-color: ${tile.background_color || 'auto'};
	color: ${tile.text_color || 'auto'};
	`}
	on:click={handle_interaction}
>
	{#if tile.navigation_page_id}
		<div class="folder-bit" />
	{/if}

	<p
		bind:this={tileTextElement}
		on:input={save_tile}
		spellcheck="false"
		contenteditable={editingTileText && $InEditMode && $EditorTool === EditorTools.text}
	>
		{tile.display_text}
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
</button>

<style>
	button {
		position: relative;
		background: var(--tile-background);
		border: 1px solid var(--tiles-border);
		color: var(--tiles-text);
		font-size: 2rem;
		white-space: pre;
		min-width: 0; /* NEW; needed for Firefox */
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	p {
		font-size: 18px;
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
		left: -1px;
		width: 50%;
		height: 5px;
		border: 1px solid var(--tiles-border);
		border-bottom: none;
		border-radius: 5px 5px 0px 0px;
		background: var(--tile-background);
	}
</style>
