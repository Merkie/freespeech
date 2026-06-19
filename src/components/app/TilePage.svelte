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
	import { moveTile, addTileToFolder } from '$ts/client/move-tile';
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
	// When hovering a folder tile, which half of the Add/Swap overlay is active.
	let folderDropSide: 'add' | 'swap' | null = null;

	// A "folder" tile is one that navigates to another page.
	const isFolderTile = (tile: Tile) => !!tile.navigation;

	// Whether the Add/Swap overlay should be shown over this tile right now.
	$: showFolderOverlay = (tile: Tile) =>
		$EditingTiles &&
		!!$DraggedTile &&
		$DraggedTile.id !== tile.id &&
		isFolderTile(tile) &&
		dragOverTileId === tile.id;

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
		folderDropSide = null;
	}

	function handleDragOver(event: DragEvent, tile: Tile) {
		if (!$EditingTiles || !$DraggedTile) return;
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
		dragOverTileId = tile.id;

		// Over a folder tile, split the cell into an "Add" (left) and "Swap"
		// (right) half and track which one the cursor is over.
		if (isFolderTile(tile) && $DraggedTile.id !== tile.id) {
			const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
			folderDropSide = event.clientX - rect.left < rect.width / 2 ? 'add' : 'swap';
		} else {
			folderDropSide = null;
		}
	}

	function handleDragLeave(tile: Tile) {
		if (dragOverTileId === tile.id) {
			dragOverTileId = null;
			folderDropSide = null;
		}
	}

	async function handleDrop(event: DragEvent, tile: Tile) {
		if (!$EditingTiles || !$DraggedTile) return;
		event.preventDefault();
		const source = $DraggedTile;
		const side = folderDropSide;
		dragOverTileId = null;
		folderDropSide = null;
		$DraggedTile = null;

		if (isFolderTile(tile) && side === 'add' && source.id !== tile.id) {
			// Drop on the "Add" half of a folder: move the tile into the folder.
			await addTileToFolder({
				source,
				folderPageId: tile.navigation,
				projectId,
				isHomePage
			});
		} else {
			// Empty cell, non-folder tile, or the "Swap" half: reposition / swap.
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
				class={`relative rounded-md transition-shadow ${
					$EditingTiles ? 'cursor-grab active:cursor-grabbing' : ''
				} ${
					dragOverTileId === tile.id && !isFolderTile(tile) ? 'ring-2 ring-blue-500' : ''
				} ${$DraggedTile && $DraggedTile.id === tile.id ? 'opacity-40' : ''}`}
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

				{#if showFolderOverlay(tile)}
					<!-- Add / Swap drop overlay for folder tiles. Extends up over the
					     folder "nub" (-top-1) so it reads as one cohesive panel. -->
					<div
						class="pointer-events-none absolute -top-1 bottom-0 left-0 right-0 z-20 flex overflow-hidden rounded-md"
					>
						<div
							class={`flex flex-1 flex-col items-center justify-center gap-1 text-center transition-all ${
								folderDropSide === 'add'
									? 'bg-emerald-600 text-white ring-2 ring-inset ring-white'
									: 'bg-zinc-900/85 text-white/50'
							}`}
						>
							<i
								class={`bi bi-folder-plus leading-none drop-shadow transition-transform ${
									folderDropSide === 'add' ? 'scale-110' : ''
								}`}
								style="font-size: clamp(20px, 3vw, 44px);"
							/>
							<span class="text-xs font-extrabold uppercase tracking-wide drop-shadow">Add</span>
						</div>
						<div class="w-0 self-stretch border-l-2 border-dashed border-white"></div>
						<div
							class={`flex flex-1 flex-col items-center justify-center gap-1 text-center transition-all ${
								folderDropSide === 'swap'
									? 'bg-blue-600 text-white ring-2 ring-inset ring-white'
									: 'bg-zinc-900/85 text-white/50'
							}`}
						>
							<i
								class={`bi bi-arrow-left-right leading-none drop-shadow transition-transform ${
									folderDropSide === 'swap' ? 'scale-110' : ''
								}`}
								style="font-size: clamp(20px, 3vw, 44px);"
							/>
							<span class="text-xs font-extrabold uppercase tracking-wide drop-shadow">Swap</span>
						</div>
					</div>
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
