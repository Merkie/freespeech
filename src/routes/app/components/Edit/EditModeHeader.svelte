<script lang="ts">
	import { addTile } from '$lib/helpers/tileActions';
	import { SelectedEditModeTool, CurrentPage, CurrentProject } from '$lib/stores';
	import type { Tile } from '$lib/types';
	import { fly } from 'svelte/transition';
	import ColorPicker from './ColorPicker.svelte';
	import ListBox from './ListBox.svelte';

	const fillAllBlankTiles = () => {
		if (!$CurrentProject) return;
		const totalTiles = $CurrentProject.columns * $CurrentProject.rows;
		const listOfCords: { x: number; y: number }[] = [];

		// Create a list of all the cords for the page
		for (let i = 0; i < totalTiles; i++) {
			const x = i % $CurrentProject.columns;
			const y = Math.floor(i / $CurrentProject.columns);
			listOfCords.push({ x, y });
		}

		// Remove all the cords that already have a tile
		$CurrentProject.pages
			.find((page) => page.name === $CurrentPage)
			?.tiles.forEach((tile) => {
				if (listOfCords.find((cord) => cord.x === tile.x && cord.y === tile.y)) {
					const index = listOfCords.findIndex((cord) => cord.x === tile.x && cord.y === tile.y);
					listOfCords.splice(index, 1);
				}
			});

		// Add a tile for each cord
		listOfCords.forEach((cord) => {
			addTile({ tilePage: $CurrentPage, x: cord.x, y: cord.y });
		});
	};

	const deleteAllBlankTiles = () => {
		if (!$CurrentProject) return;

		// Remove all the tiles that are blank
		$CurrentProject = {
			...$CurrentProject,
			pages: $CurrentProject.pages.map((page) => {
				if (page.name === $CurrentPage) {
					return {
						...page,
						tiles: page.tiles.filter(
							(tile) => tile.text !== 'New Tile' && tile.image !== null && tile.navigateTo !== null
						)
					};
				}
				return page;
			})
		};
	};
</script>

<div class="flex items-center gap-4 text-zinc-200 p-2 bg-zinc-900">
	<p
		class="flex items-center gap-2 font-bold bg-blue-700 border border-blue-500 w-fit p-1 rounded-md px-2"
	>
		<img src="/logo-transparent.png" alt="logo" width={20} /> FreeSpeech
		<span style="font-size: 10px" class="font-mono font-thin mt-[5px]">v0.1</span>
	</p>
	<span
		>Tool: <span class="capitalize bg-zinc-800 p-1 px-2 rounded-md">{$SelectedEditModeTool}</span
		></span
	>
	{#if $SelectedEditModeTool === 'cursor'}
		<ListBox
			title={'page actions'}
			options={[
				{
					label: 'fill all tiles',
					onClick: fillAllBlankTiles
				},
				{ label: 'delete unedited tiles', onClick: deleteAllBlankTiles }
			]}
		/>
	{/if}
	{#if $SelectedEditModeTool === 'text'}
		<ListBox
			title={'text mode'}
			selected={'display text'}
			options={[{ label: 'display text' }, { label: 'speak text' }]}
		/>
	{/if}
	{#if $SelectedEditModeTool === 'image'}
		<ListBox
			title={'storage setting'}
			selected={'s3 bucket'}
			options={[{ label: 'base64' }, { label: 's3 bucket' }]}
		/>
	{/if}
	{#if $SelectedEditModeTool === 'color'}
		<ListBox
			title={'color mode'}
			selected={'border'}
			options={[{ label: 'border' }, { label: 'background' }, { label: 'text' }]}
		/>
		<ColorPicker />
	{/if}
</div>
