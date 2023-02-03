<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import {
		AppMode,
		CurrentPage,
		CurrentProject,
		EditModeNavigation,
		SelectedEditModeTool,
		type ProjectExpanded
	} from '$lib/stores';
	import type { Page, Tile } from '$lib/types';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let tile: Tile;

	let editingTileText = false;
	let tileTextInput: HTMLInputElement | null = null;
	let draggingFileOver = false;
	let fileInput: HTMLInputElement;
	let imageBase64: string;
	1;

	// A function that updates the one tile that the component is responsible for inside the store
	function updateTileStore(newTile: Tile) {
		$CurrentProject = {
			...$CurrentProject,
			pages: $CurrentProject?.pages.map((page: Page & { tiles: Tile[] }) => {
				if (page.name !== $CurrentPage) return page;
				return {
					...page,
					tiles: page.tiles.map((_tile: Tile) => {
						if (tile._id !== _tile._id) return _tile;
						return newTile;
					})
				};
			})
		} as ProjectExpanded;
	}

	// Handles the events that occur when a user taps or clicks a tile
	const handleInteraction = () => {
		if ($AppMode === 'edit') {
			if ($SelectedEditModeTool === 'text') {
				editingTileText = true;
				// force focus
				setTimeout(() => {
					tileTextInput?.focus();
				}, 0);
			} else if ($SelectedEditModeTool === 'navigation') {
				$EditModeNavigation = { tileid: tile._id, pagename: undefined };
			}
		} else {
			if (tile.navigateTo) {
				$CurrentPage = tile.navigateTo;
				return;
			}
		}
	};

	// Handles the events that occur when a user clicks outside of the tile
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

	// Handles the file upload when upload an image
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

			// if the tile already has an image, delete it
			if (tile.image) {
				await fetch('/api/v1/cloud/delete', {
					method: 'POST',
					body: JSON.stringify({
						location: tile.image
					})
				});
			}

			const response = await (
				await fetch('/api/v1/cloud/upload', {
					method: 'POST',
					body: JSON.stringify({
						data: image
					})
				})
			).json();

			const updatedTile = {
				...tile,
				image: response.location
			};

			updateTileStore(updatedTile as Tile);
		}
	};

	// This can be abstracted out to a utils file
	const urlToBase64String = async (url: string) => {
		const response = await fetch(url);
		const blob = await response.blob();
		const reader = new FileReader();
		const base64Promise = new Promise((resolve, reject) => {
			reader.onloadend = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
		reader.readAsDataURL(blob);
		return base64Promise;
	};

	// Convert the image url to a base64 string for rendering
	$: {
		if (tile.image) {
			urlToBase64String(tile.image).then((base64) => {
				imageBase64 = base64 as string;
			});
		}
	}

	$: {
		// This triggers when the user is updating the navigation of a tile
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
	use:clickOutside={handleOutsideClick}
	on:click={handleInteraction}
	in:scale={{ duration: 300, delay: Math.random() * 200 }}
	class={`border relative p-2 rounded-sm ${
		!draggingFileOver &&
		!(
			$EditModeNavigation.tileid === tile._id &&
			$AppMode === 'edit' &&
			$SelectedEditModeTool === 'navigation'
		)
			? 'bg-zinc-100 border-zinc-400'
			: ''
	} ${draggingFileOver ? 'bg-emerald-600 border-emerald-400 text-emerald-100' : ''} ${
		$EditModeNavigation.tileid === tile._id &&
		$AppMode === 'edit' &&
		$SelectedEditModeTool === 'navigation'
			? 'bg-blue-500 border-blue-700 text-blue-50 border-dashed'
			: ''
	}`}
>
	{#if !draggingFileOver}
		<div
			class={`absolute left-0 p-2 top-0 w-full h-full flex gap-2 flex-col items-center justify-center`}
		>
			{#if editingTileText}
				<input size={10} class="text-center w-fit" bind:this={tileTextInput} value={tile.text} />
			{:else}
				<p>{tile.text}</p>
			{/if}

			{#if tile.image}
				<div class="relative flex-1 w-full">
					<img class="absolute h-full left-1/2 -translate-x-1/2" src={imageBase64 || ''} alt="" />
				</div>
			{/if}
		</div>
	{:else}
		<input
			bind:this={fileInput}
			on:input={handleUpload}
			type="file"
			class="absolute top-0 left-0 w-full pointer-events-auto h-full opacity-0 http://127.0.0.1:5173/"
		/>
		<i class="bi bi-plus-lg text-xl" />
	{/if}
	{#if tile.navigateTo}
		<i class="bi bi-folder bottom-1 right-2 absolute" />
	{/if}
</button>
