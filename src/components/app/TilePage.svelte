<script lang="ts">
	// stores
	import {
		EditingTiles,
		TileBeingEdited,
		EnableTileAnimations,
		DraggedTile
	} from '$ts/client/stores';
	// components
	import TileComponent from '$components/app/Tile.svelte';
	import AddTileButton from '$components/app/AddTileButton.svelte';
	// helpers
	import { scale } from 'svelte/transition';
	import { moveTile } from '$ts/client/move-tile';
	// types
	import type { Tile } from '$ts/common/types';

	export let tiles: Tile[];
	export let columns: number;
	export let rows: number;
	export let projectId: string;
	export let pageId: string;
	export let isHomePage: boolean;

	export let containerHeight: number;
	export let subpage = 0;

	let unusedCoords: { x: number; y: number }[] = [];

	// Tile currently being hovered over as a drop target (for visual feedback).
	let dragOverTileId: string | null = null;

	function handleDragStart(event: DragEvent, tile: Tile) {
		if (!$EditingTiles) return;
		$DraggedTile = tile;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', tile.id);
		}
	}

	function handleDragEnd() {
		$DraggedTile = null;
		dragOverTileId = null;
	}

	function handleDragOver(event: DragEvent, tile: Tile) {
		if (!$EditingTiles || !$DraggedTile) return;
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
		dragOverTileId = tile.id;
	}

	function handleDragLeave(tile: Tile) {
		if (dragOverTileId === tile.id) dragOverTileId = null;
	}

	async function handleDrop(event: DragEvent, tile: Tile) {
		if (!$EditingTiles || !$DraggedTile) return;
		event.preventDefault();
		const source = $DraggedTile;
		dragOverTileId = null;
		$DraggedTile = null;
		await moveTile({
			source,
			targetX: tile.x,
			targetY: tile.y,
			targetPage: tile.page,
			occupant: tile,
			projectId,
			isHomePage
		});
	}

	$: {
		// fill array with all possible cords, 6 cols and 4 rows, starting with 0,0
		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				unusedCoords.push({ x, y });
			}
		}
		const usedCoords = tiles.map((tile) => ({ x: tile.x, y: tile.y }));
		// filter out used coords
		unusedCoords = unusedCoords.filter(
			(coord) =>
				!usedCoords?.find((usedCoord) => usedCoord.x === coord.x && usedCoord.y === coord.y)
		);
	}
</script>

<div
	style={`height: ${containerHeight}px; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr);`}
	class={`grid gap-2 p-2 ${subpage % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200'}`}
>
	{#if tiles}
		{#each tiles as tile (tile.id)}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				data-sveltekit-preload-data
				style={`grid-row: ${tile.y + 1}; grid-column: ${tile.x + 1};`}
				class={`rounded-md transition-shadow ${
					$EditingTiles ? 'cursor-grab active:cursor-grabbing' : ''
				} ${dragOverTileId === tile.id ? 'ring-2 ring-blue-500' : ''} ${
					$DraggedTile && $DraggedTile.id === tile.id ? 'opacity-40' : ''
				}`}
				draggable={$EditingTiles}
				on:dragstart={(event) => handleDragStart(event, tile)}
				on:dragend={handleDragEnd}
				on:dragover={(event) => handleDragOver(event, tile)}
				on:dragleave={() => handleDragLeave(tile)}
				on:drop={(event) => handleDrop(event, tile)}
				in:scale={{ delay: $EnableTileAnimations ? Math.random() * 200 : 0, duration: $EnableTileAnimations ? 400 : 0 }}
			>
				{#if tile.navigation && !$EditingTiles}
					<a href={`/app/project/${projectId}/${tile.navigation}`}>
						<TileComponent
							tile={$EditingTiles && $TileBeingEdited?.id === tile.id ? $TileBeingEdited : tile}
						/>
					</a>
				{:else}
					<TileComponent
						tile={$EditingTiles && $TileBeingEdited?.id === tile.id ? $TileBeingEdited : tile}
					/>
				{/if}
			</div>
		{/each}
		{#if $EditingTiles}
			{#each unusedCoords as unusedCoord}
				<AddTileButton {projectId} {pageId} {isHomePage} {subpage} {...unusedCoord} />
			{/each}
		{/if}
	{/if}
</div>
