<script lang="ts">
	// stores
	import { EditingTiles, TileBeingEdited } from '$ts/client/stores';
	// components
	import TileComponent from '$components/app/Tile.svelte';
	import AddTileButton from '$components/app/AddTileButton.svelte';
	// helpers
	import { scale } from 'svelte/transition';
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
			<div
				style={`grid-row: ${tile.y + 1}; grid-column: ${tile.x + 1};`}
				in:scale={{ delay: Math.random() * 200 }}
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
