<script lang="ts">
	import { CurrentProject, AppMode, CurrentPage, TemplateMode } from '$lib/stores';
	import type { Tile, Project } from '$lib/types';
	import TileElement from './Tile.svelte';
	import AddTileGhostButton from './AddTileGhostButton.svelte';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';

	let tilePageElement: HTMLElement;

	// Onmount script that takes a screenshot of the tile page and uploads it to the cloud
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		html2canvas(tilePageElement, {
			allowTaint: true
		}).then(async (canvas) => {
			const img = canvas.toDataURL('image/png');
			if (!$CurrentProject) return;

			// Delete the old image
			if ($CurrentProject?.image) {
				await fetch('/api/v1/cloud/delete', {
					method: 'POST',
					body: JSON.stringify({
						location: $CurrentProject.image
					})
				});
			}

			// upload the new image
			const response = await (
				await fetch('/api/v1/cloud/upload', {
					method: 'POST',
					body: JSON.stringify({
						data: img
					})
				})
			).json();

			// update the project locally
			$CurrentProject = {
				...$CurrentProject,
				image: response.location
			};

			// update the project on the server
			await fetch('/api/v1/project/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					project: $CurrentProject
				})
			});
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
