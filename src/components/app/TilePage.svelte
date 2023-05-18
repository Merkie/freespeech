<script lang="ts">
	// stores
	import { ActiveProject, isEditing } from '$ts/client/stores';
	// components
	import Tile from '$components/app/Tile.svelte';
	import AddTileButton from '$components/app/AddTileButton.svelte';
	// helpers
	import stringGate from '$ts/common/stringGate';
	import { scale } from 'svelte/transition';
	// types
	import type { Tile as ITile } from '$ts/common/types';

	export let containerHeight: number;
	export let tiles: ITile[] = [];
	export let subpage = 0;
	export let speakText: (text: string) => void;
	let unusedCoords: { x: number; y: number }[] = [];

	$: {
		if ($ActiveProject) {
			// fill array with all possible cords, 6 cols and 4 rows, starting with 0,0
			for (let x = 0; x < $ActiveProject.columns; x++) {
				for (let y = 0; y < $ActiveProject.rows; y++) {
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
	}
</script>

<div
	style={`height: ${containerHeight}px; grid-template-columns: repeat(${$ActiveProject?.columns}, 1fr); grid-template-rows: repeat(${$ActiveProject?.rows}, 1fr);`}
	class={`grid gap-2 p-2 ${subpage % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200'}`}
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
						href={`/app/project/${stringGate($ActiveProject.name).toLowerCase()}/${stringGate(
							tile.navigation
						).toLowerCase()}`}
					>
						<Tile {speakText} {subpage} {...tile} />
					</a>
				{:else}
					<!-- Else, just add the tile -->
					<Tile {speakText} {subpage} {...tile} />
				{/if}
			</div>
		{/each}
		{#if $isEditing}
			<!-- If the user is editing the page, fill all blank spots with
				   "add tile" buttons -->
			{#each unusedCoords as unusedCoord}
				<!-- TODO: add animation -->
				<AddTileButton {subpage} {...unusedCoord} />
			{/each}
		{/if}
	{/if}
</div>
