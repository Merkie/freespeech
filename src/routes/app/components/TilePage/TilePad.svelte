<script lang="ts">
	import { CurrentProject, AppMode, CurrentPage } from '$lib/stores';
	import type { Tile, ProjectExpanded } from '$lib/types';
	import TileElement from './Tile.svelte';
	import AddTileGhostButton from './AddTileGhostButton.svelte';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';

	let tilePageElement: HTMLElement;

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		html2canvas(tilePageElement, {
			allowTaint: true
		}).then(function (canvas) {
			const img = canvas.toDataURL('image/png');
			if (!$CurrentProject) return;
			$CurrentProject = {
				...$CurrentProject,
				image: img
			};
		});
	});

	let tileArray: { tile: Tile | undefined; x: number; y: number }[] = [];
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
	bind:this={tilePageElement}
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
