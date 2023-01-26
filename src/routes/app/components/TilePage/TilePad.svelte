<script lang="ts">
	import { CurrentProject, AppMode, CurrentPage, type ProjectExpanded } from '$lib/stores';
	import type { Tile } from '@prisma/client';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import TileElement from './Tile.svelte';
	import AddTileGhostButton from './AddTileGhostButton.svelte';

	let tileArray: { tile: Tile | undefined; x: number; y: number }[] = [];

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		// animationWindow = false;
	});

	$: {
		tileArray = [];
		if ($CurrentProject && $CurrentProject.pages) {
			for (let row = 0; row < $CurrentProject.rows; row++) {
				for (let col = 0; col < $CurrentProject.columns; col++) {
					const page = $CurrentProject.pages.find((page) => page.name === $CurrentPage);
					if (page?.tiles.find((tile) => tile.x === col && tile.y === row)) {
						tileArray.push({
							tile: page?.tiles.find((tile) => tile.x === col && tile.y === row) as Tile,
							x: col,
							y: row
						});
					} else {
						tileArray.push({ tile: undefined, x: col, y: row });
					}
				}
			}
		}
		tileArray = [...tileArray];
	}
</script>

<section
	style={`grid-template-columns: repeat(${$CurrentProject?.columns}, 1fr); grid-template-rows: repeat(${$CurrentProject?.rows}, 1fr);`}
	class={`flex-1 p-2 gap-2 grid`}
>
	{#each tileArray as tile}
		{#if tile.tile}
			<TileElement tile={tile.tile} />
		{:else if $AppMode === 'edit'}
			<AddTileGhostButton x={tile.x} y={tile.y} />
		{:else}
			<div />
		{/if}
	{/each}
</section>
