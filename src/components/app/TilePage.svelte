<script lang="ts">
	import { ActiveProject, isEditing } from '$ts/client/stores';
	import Tile from '$components/app/Tile.svelte';
	import AddTileButton from '$components/app/AddTileButton.svelte';
	export let containerHeight: number;
	import type ITile from '$ts/types/Tile';
	import stringGate from '$ts/common/stringGate';
	import { scale } from 'svelte/transition';

	export let tiles: ITile[] = [];
	export let page = 0;
	export let speakText: (text: string) => void;
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

<div
	style={`height: ${containerHeight}px;`}
	class={`grid grid-cols-6 grid-rows-4 gap-2 p-2 ${page % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200'}`}
>
	{#if tiles && $ActiveProject}
		{#each tiles as tile}
			<!-- if the tile has navigation and the user is not editing the page,
					 wrap the tile in an <a> tag with the correct href -->
			<div
				style={`grid-row: ${tile.y + 1}; grid-column: ${tile.x + 1};`}
				in:scale={{ delay: Math.random() * 200 }}
			>
				{#if tile.navigation && !$isEditing}
					<a
						href={`/app/${stringGate($ActiveProject.name).toLowerCase()}/${stringGate(
							tile.navigation
						).toLowerCase()}`}
					>
						<Tile {speakText} subpage={page} {...tile} />
					</a>
				{:else}
					<!-- Else, just add the tile -->
					<Tile {speakText} subpage={page} {...tile} />
				{/if}
			</div>
		{/each}
		{#if $isEditing}
			<!-- If the user is editing the page, fill all blank spots with
				   "add tile" buttons -->
			{#each unusedCoords as unusedCoord}
				<!-- TODO: add animation -->
				<AddTileButton {page} {...unusedCoord} />
			{/each}
		{/if}
	{/if}
</div>
