<script lang="ts">
	//@ts-nocheck
	import { AppProject, CurrentPageId, InEditMode } from '$lib/client/stores';
	import Tile from './Tile.svelte';
	import type { Tile as ITile } from '@prisma/client';
	import trpc from '$lib/client/trpc';
	import { onMount } from 'svelte';

	if (!$CurrentPageId) {
		$CurrentPageId = $AppProject.pages[0].id;
		console.log($CurrentPageId);
	}

	// Current page index
	let current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);

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
				display_text: 'New Tile'
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

	// This will fix the indexes whenever the page loads
	const fix_tile_indexes = async () => {
		// 1) sort the tiles by their index
		$AppProject.pages[current_page_index].tiles = $AppProject.pages[current_page_index].tiles.sort(
			(a, b) => a.tile_index - b.tile_index
		);

		// 2) fix the indexes
		$AppProject.pages[current_page_index].tiles.forEach((tile, index) => {
			tile.tile_index = index;
		});

		// 3) Get a list of the indexes
		const indexes = $AppProject.pages[current_page_index].tiles.map((tile) => tile.tile_index);

		await trpc(fetch).mutation('tile:reorder', {
			page_id: $AppProject.pages[current_page_index].id,
			indexes
		});
	};

	let rows =
		$AppProject.pages[current_page_index].tiles.length /
			$AppProject.pages[current_page_index].columns +
		1;

	onMount(async () => {
		await fix_tile_indexes();
	});

	let items = $AppProject.pages[current_page_index].tiles;

	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	const flipDurationMs = 300;
	function handleDndConsider(e: { detail: any }) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: { detail: any }) {
		items = e.detail.items;
	}

	$: {
		current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		items = $AppProject.pages[current_page_index].tiles;
	}
</script>

<div
	style={`
	--rows: ${$InEditMode ? rows + 2 : rows};
	--columns: ${$AppProject.pages[current_page_index].columns};
`}
	use:dndzone={{
		items,
		flipDurationMs
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as tile (tile.id)}
		<span animate:flip={{ duration: flipDurationMs }}> <Tile {tile} /></span>
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
	}
	.add-tile {
		background-color: transparent;
		border: 2px dashed var(--tiles-text);
		color: var(--tiles-text);
	}
</style>
