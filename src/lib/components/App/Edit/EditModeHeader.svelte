<script lang="ts">
	import { addTile } from '$lib/ts/tileActions';
	import {
		SelectedEditModeTool,
		CurrentPage,
		CurrentProject,
		EditModeColor,
		TemplateMode
	} from '$lib/stores';
	import ColorPicker from './ColorPicker.svelte';
	import ListBox from './ListBox.svelte';

	// TODO: Put these in $lib/ts and fix bugs
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

	// TODO: Put these in $lib/ts and fix bugs
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

<div
	class="flex items-center text-zinc-200 p-2 h-[50px] bg-zinc-900 border border-x-0 border-t-0 border-zinc-700 text-sm"
>
	<!-- FreeSpeech Name, Version & Logo -->
	<p class="flex items-center gap-2 font-bold w-fit p-1 rounded-md px-2">
		<img src="/logo-transparent.png" alt="logo" width={15} /> FreeSpeech
		<span style="font-size: 10px" class="font-mono font-thin mt-[5px]">v0.1</span>
	</p>
	<!-- Horizontal Divider -->
	<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
	<!-- Selected Tool Indicator -->
	<span class="opacity-75 mr-2">Tool:</span><span class="capitalize">{$SelectedEditModeTool}</span>

	<!-- Display when cursor tool is selected -->
	{#if $SelectedEditModeTool === 'cursor'}
		<!-- Horizontal Divider -->
		<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
		<!-- Dropdown "listbox" for page actions -->
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
		<!-- Horizontal Divider -->
		<!-- <div class="h-[20px] w-[1px] bg-zinc-700 mx-2" /> -->
		<!-- Dropdown "listbox" for template actions -->
		<!-- <ListBox
			title={'template'}
			options={[
				{
					label: 'create template from page',
					onClick: () => {
						$TemplateMode = { mode: 'create', templateid: '' };
					}
				},
				{
					label: 'apply template to page',
					onClick: () => {}
				},
				{
					label: 'manage templates',
					onClick: () => {}
				}
			]}
		/> -->
	{/if}

	<!-- Display when text tool is selected -->
	{#if $SelectedEditModeTool === 'text'}
		<!-- Horizontal Divider -->
		<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
		<!-- Dropdown for different text modes, speak and display -->
		<ListBox
			title={'text mode'}
			selected={'display text'}
			options={[{ label: 'display text' }, { label: 'speak text' }]}
		/>
	{/if}

	<!-- Display when color tool is selected -->
	{#if $SelectedEditModeTool === 'color'}
		<!-- Horizontal Divider -->
		<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
		<!-- Dropdown for different color modes, border, background, and text color -->
		<ListBox
			title={'color mode'}
			selected={'border'}
			options={[
				{
					label: 'border',
					onClick: () => {
						$EditModeColor = { ...$EditModeColor, mode: 'border' };
					}
				},
				{
					label: 'background',
					onClick: () => {
						$EditModeColor = { ...$EditModeColor, mode: 'background' };
					}
				},
				{
					label: 'text',
					onClick: () => {
						$EditModeColor = { ...$EditModeColor, mode: 'text' };
					}
				}
			]}
		/>
		<!-- Horizontal Divider -->
		<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
		<!-- Color Picker Component -->
		<ColorPicker />
	{/if}

	{#if $SelectedEditModeTool === 'template' && $TemplateMode.mode !== 'disabled'}
		<div class="h-[20px] w-[1px] bg-zinc-700 mx-2" />
		<button class="bg-blue-700 border border-blue-600 px-4 p-1 rounded-md mr-2">Save Changes</button
		>
		<button class="bg-zinc-700 border border-zinc-600 px-4 p-1 rounded-md">Cancel</button>
	{/if}

	<div class="flex-1" />

	<!-- undo button -->
	<button>
		<i class="bi bi-arrow-counterclockwise text-lg" />
	</button>
</div>
