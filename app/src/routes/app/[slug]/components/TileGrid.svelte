<script lang="ts">
	//@ts-nocheck
	// Stores
	import {
		AppProject,
		PageHistoryIndex,
		CurrentPageId,
		InEditMode,
		PageHistory
	} from '$lib/client/stores';

	// Components
	import Tile from './Tile.svelte';

	// Types
	import type { Tile as ITile } from '@prisma/client';

	// Trpc
	import trpc from '$lib/client/trpc';
	import { onMount } from 'svelte';

	// config
	const min_row_count = 5; // minimum number of rows

	// If no current page id, assume home
	if (!$CurrentPageId) {
		$CurrentPageId = $AppProject.pages.find((page) => page.name.toLowerCase() === 'home')?.id;
		$PageHistory = [$CurrentPageId];
	}

	// State
	let current_page_index;
	let rows;

	// Adds a tile to the current page
	const add_tile = async () => {
		// 1) Get the temp id and index of the new tile
		const temp_id = Math.random().toString(36).substring(7);
		let new_tile_index = $AppProject.pages[current_page_index].tiles.length;

		// 2) Add the temp tile to the store
		$AppProject.pages[current_page_index].tiles = [
			...$AppProject.pages[current_page_index].tiles,
			{
				id: temp_id,
				display_text: 'New tile'
			} as ITile
		];

		// 3) Create the tile in the backend
		const response_tile = await trpc(fetch).mutation('page:add_tile', {
			index: $AppProject.pages[current_page_index].tiles.length,
			page_id: $AppProject.pages[current_page_index].id
		});
		if (!response_tile) return;

		// 4) Replace the temp tile with the new tile
		$AppProject.pages[current_page_index].tiles[new_tile_index] = response_tile;
	};

	$: {
		current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		let most_rows = 0;
		$AppProject.pages.forEach((page) => {
			let row_count = Math.floor(1 + page.tiles.length / page.columns);
			if (row_count > most_rows) most_rows = row_count;
		});
		rows = Math.max(
			min_row_count,
			most_rows,
			Math.floor(
				2 +
					($AppProject.pages[current_page_index].tiles.length - 1) /
						$AppProject.pages[current_page_index].columns
			)
		);
	}
</script>

<div
	style={`
	--rows: ${$InEditMode ? rows + 2 : rows};
	--columns: ${$AppProject.pages[current_page_index].columns};
`}
>
	{#each $AppProject.pages[current_page_index].tiles as tile (tile.id)}
		<Tile {tile} />
	{/each}

	<button
		disabled={!$InEditMode}
		style={`opacity: ${$InEditMode ? '1' : '0'};`}
		class="add-tile"
		on:click={add_tile}
	>
		<i class="bx bx-plus" />
	</button>
</div>

<style>
	div {
		width: auto;
		flex: 1;
		background-color: var(--tiles-background);
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
		gap: 10px;
		padding: 10px;
		overflow-x: hidden;
	}
	.add-tile {
		background-color: transparent;
		border: 2px dashed var(--tiles-text);
		color: var(--tiles-text);
	}
</style>
