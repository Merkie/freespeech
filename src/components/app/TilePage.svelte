<script lang="ts">
	import { AppMode } from '$ts/client/stores';
	import Tile from '$components/app/Tile.svelte';
	import AddTileButton from '$components/app/AddTileButton.svelte';
	export let containerHeight: number;
	import type ITile from '$ts/types/Tile';

	export let tiles: ITile[] = [];
	export let page = 0;
	let unusedCoords: { x: number; y: number }[] = [];

	$: {
		// fill array with all possible cords, 6 cols and 4 rows, starting with 0,0
		for (let x = 0; x < 6; x++) {
			for (let y = 0; y < 4; y++) {
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

<div style={`height: ${containerHeight}px;`} class="grid grid-cols-6 grid-rows-4 gap-2 p-2">
	{#if tiles}
		{#each tiles as tile, index}
			<Tile subpage={page} {...tile} />
		{/each}
		{#if $AppMode === 'edit'}
			{#each unusedCoords as unusedCoord}
				<AddTileButton {page} {...unusedCoord} />
			{/each}
		{/if}
	{/if}
</div>
