<script lang="ts">
	import { SelectedEditModeTool, CurrentPage, CurrentProject } from '$lib/stores';
	import type { Tile } from '@prisma/client';
	import { fly } from 'svelte/transition';
	import ListBox from './ListBox.svelte';

	const fillAllBlankTiles = () => {
		if (!$CurrentProject) return;
		const totalTiles = $CurrentProject.columns * $CurrentProject.rows;
		const listOfCords: { x: number; y: number }[] = [];
		for (let i = 0; i < totalTiles; i++) {
			const x = i % $CurrentProject.columns;
			const y = Math.floor(i / $CurrentProject.columns);
			listOfCords.push({ x, y });
		}
		$CurrentProject.pages
			.find((page) => page.name === $CurrentPage)
			?.tiles.forEach((tile) => {
				if (listOfCords.find((cord) => cord.x === tile.x && cord.y === tile.y)) {
					const index = listOfCords.findIndex((cord) => cord.x === tile.x && cord.y === tile.y);
					listOfCords.splice(index, 1);
				}
			});

		listOfCords.forEach((cord) => {
			$CurrentProject?.pages
				.find((page) => page.name === $CurrentPage)
				?.tiles.push({
					x: cord.x,
					y: cord.y,
					text: 'New Tile',
					id: Math.random().toString(36).substr(2, 9)
				} as Tile);
		});

		$CurrentProject = $CurrentProject;
	};

	const deleteAllBlankTiles = () => {
		if (!$CurrentProject) return;

		//@ts-ignore
		$CurrentProject.pages.find((page) => page.name === $CurrentPage).tiles = $CurrentProject.pages
			.find((page) => page.name === $CurrentPage)
			?.tiles.filter((tile) => tile.text !== 'New Tile');

		$CurrentProject = $CurrentProject;
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
</div>
