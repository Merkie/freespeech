<script lang="ts">
	import { CurrentProject, AppMode, CurrentPage, type ProjectExpanded } from '$lib/stores';
	import type { Tile } from '@prisma/client';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import TileElement from './Tile.svelte';

	const createTile = (x: number, y: number) => {
		$CurrentProject?.pages
			.find((page) => page.name === $CurrentPage)
			?.tiles.push({
				x,
				y,
				text: 'New Tile'
			} as Tile);

		$CurrentProject = { ...$CurrentProject } as ProjectExpanded;
	};

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
			<button
				in:scale={{ duration: 300, delay: Math.random() * 200 }}
				out:scale|local={{ duration: 0 }}
				on:click={() => createTile(tile.x, tile.y)}
				class="border bg-zinc-200 border-zinc-400 border-dashed rounded-sm"
				><i class="bi bi-plus-lg text-zinc-500 text-xl" /></button
			>
		{:else}
			<div />
		{/if}
	{/each}
</section>
