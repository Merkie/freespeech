<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import {
		ActiveDraggingTile,
		AppMode,
		CurrentPage,
		CurrentProject,
		EditModeNavigation,
		SelectedEditModeTool,
		type ProjectExpanded
	} from '$lib/stores';
	import type { Page, Tile } from '@prisma/client';
	import { scale } from 'svelte/transition';
	import { insert } from 'svelte/internal';
	export let tile: Tile;

	let editingTileText = false;
	let tileTextInput: HTMLInputElement | null = null;
	let draggingFileOver = false;
	let fileInput: HTMLInputElement;

	function updateTileStore(newTile: Tile) {
		$CurrentProject = {
			...$CurrentProject,
			pages: $CurrentProject?.pages.map((page: Page & { tiles: Tile[] }) => {
				if (page.name !== $CurrentPage) return page;
				return {
					...page,
					tiles: page.tiles.map((_tile: Tile) => {
						if (tile.id !== _tile.id) return _tile;
						return newTile;
					})
				};
			})
		} as ProjectExpanded;
	}

	const handleInteraction = () => {
		if ($AppMode === 'edit') {
			if ($SelectedEditModeTool === 'text') {
				editingTileText = true;
				// force focus
				setTimeout(() => {
					tileTextInput?.focus();
				}, 0);
			} else if ($SelectedEditModeTool === 'navigation') {
				$EditModeNavigation = { tileid: tile.id, pagename: undefined };
			}
		} else {
			if (tile.navigateTo) {
				$CurrentPage = tile.navigateTo;
				return;
			}
		}
	};

	const handleOutsideClick = () => {
		if (editingTileText) {
			const updatedTile = {
				...tile,
				text: tileTextInput?.value || ''
			};
			updateTileStore(updatedTile);
			editingTileText = false;
		}
	};

	const handleUpload = async () => {
		draggingFileOver = false;
		const file = fileInput.files?.[0];
		if (file) {
			const reader = new FileReader();
			const base64Promise = new Promise((resolve, reject) => {
				reader.onloadend = () => {
					resolve(reader.result);
				};
				reader.onerror = reject;
			});
			reader.readAsDataURL(file);
			const image = await base64Promise;
			const updatedTile = {
				...tile,
				image: image
			};
			updateTileStore(updatedTile as Tile);
		}
	};

	$: {
		if ($EditModeNavigation.tileid && $EditModeNavigation.pagename) {
			updateTileStore({
				...tile,
				navigateTo: $EditModeNavigation.pagename
			});
			$EditModeNavigation = { tileid: undefined, pagename: undefined };
		}
	}
</script>

<button
	on:dragenter={() => {
		if ($AppMode === 'edit' && $SelectedEditModeTool === 'image') {
			draggingFileOver = true;
		}
	}}
	on:dragleave={() => (draggingFileOver = false)}
	draggable={true}
	on:drag={() => ($ActiveDraggingTile = tile)}
	on:dragend={() => ($ActiveDraggingTile = undefined)}
	use:clickOutside={handleOutsideClick}
	on:click={handleInteraction}
	in:scale={{ duration: 300, delay: Math.random() * 200 }}
	out:scale|local={{ duration: 0 }}
	class={`border relative p-2 rounded-sm ${
		draggingFileOver
			? 'bg-emerald-600 border-emerald-400 text-emerald-100'
			: 'bg-zinc-100 border-zinc-400'
	} ${
		$EditModeNavigation.tileid === tile.id &&
		$AppMode === 'edit' &&
		$SelectedEditModeTool === 'navigation'
			? 'bg-blue-500 border-blue-700 text-blue-50 border-dashed'
			: ''
	} `}
>
	{#if !draggingFileOver}
		<div
			class={`relative w-full h-full overflow-hidden ${
				tile.image ? '' : 'grid place-items-center'
			}`}
		>
			{#if editingTileText}
				<input size={10} class="text-center w-fit" bind:this={tileTextInput} value={tile.text} />
			{:else}
				<p>{tile.text}</p>
			{/if}
			{#if tile.image}
				<img draggable={false} class="absolute object-contain" src={tile.image || ''} alt="" />
			{/if}
		</div>
	{:else}
		<input
			bind:this={fileInput}
			on:input={handleUpload}
			type="file"
			class="absolute top-0 left-0 w-full pointer-events-auto h-full"
		/>
		<i class="bi bi-plus-lg text-xl" />
	{/if}
	{#if tile.navigateTo}
		<i class="bi bi-folder bottom-1 right-2 absolute" />
	{/if}
</button>
