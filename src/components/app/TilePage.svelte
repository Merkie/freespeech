<script lang="ts">
	import { ActivePage, ActiveProject, AppMode } from '$ts/client/stores';
	import AddTileButton from './AddTileButton.svelte';
	import Tile from './Tile.svelte';
	export let containerHeight: number;
	import type { TilePage } from '@prisma/client';

	let pageData:
		| (TilePage & { data: { tiles: { text: string; image?: string; x: number; y: number }[] } })
		| undefined;

	let unusedCoords: { x: number; y: number }[] = [];

	//@ts-ignore
	$: pageData = $ActiveProject?.pages.find((page) => page.name === $ActivePage);
	$: {
		// fill array with all possible cords, 6 cols and 4 rows, starting with 0,0
		for (let x = 0; x < 6; x++) {
			for (let y = 0; y < 4; y++) {
				unusedCoords.push({ x, y });
			}
		}
		const usedCoords = pageData?.data.tiles.map((tile) => ({ x: tile.x, y: tile.y }));
		// filter out used coords
		unusedCoords = unusedCoords.filter(
			(coord) =>
				!usedCoords?.find((usedCoord) => usedCoord.x === coord.x && usedCoord.y === coord.y)
		);
	}
</script>

<div
	style={`height: ${containerHeight}px;`}
	class="grid grid-cols-4 grid-rows-6 md:grid-cols-6 md:grid-rows-4 gap-2 p-2"
>
	{#if pageData}
		{#each pageData.data.tiles as tile}
			<Tile {...tile} />
		{/each}
		{#if $AppMode === 'edit'}
			{#each unusedCoords as unusedCoord}
				<AddTileButton {...unusedCoord} />
			{/each}
		{/if}
	{/if}
</div>
