<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import {
		AppMode,
		CurrentPage,
		CurrentProject,
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

	const handleInteraction = () => {
		if ($AppMode === 'edit') {
			if ($SelectedEditModeTool === 'text') {
				editingTileText = true;
				// force focus
				setTimeout(() => {
					tileTextInput?.focus();
				}, 0);
			}
		}
	};

	const handleOutsideClick = () => {
		if (editingTileText) {
			$CurrentProject = {
				...$CurrentProject,
				pages: $CurrentProject?.pages.map((page) => {
					if (page.name !== $CurrentPage) return page;
					return {
						...page,
						tiles: page.tiles.map((_tile) => {
							if (tile.id !== _tile.id) return _tile;
							return {
								..._tile,
								text: tileTextInput?.value || ''
							};
						})
					};
				})
			} as ProjectExpanded;
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
			$CurrentProject = {
				...$CurrentProject,
				pages: $CurrentProject?.pages.map((page) => {
					if (page.name !== $CurrentPage) return page;
					return {
						...page,
						tiles: page.tiles.map((_tile) => {
							if (tile.id !== _tile.id) return _tile;
							return {
								..._tile,
								image: image
							};
						})
					};
				})
			} as ProjectExpanded;
		}
	};
</script>

<button
	on:dragenter={() => (draggingFileOver = true)}
	on:dragleave={() => (draggingFileOver = false)}
	use:clickOutside={handleOutsideClick}
	on:click={handleInteraction}
	in:scale={{ duration: 300, delay: Math.random() * 200 }}
	out:scale|local={{ duration: 0 }}
	class={`border relative p-2 rounded-sm ${
		draggingFileOver
			? 'bg-emerald-500 border-emerald-300 text-emerald-100'
			: 'bg-zinc-100 border-zinc-400'
	}`}
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
				<img class="absolute object-contain" src={tile.image || ''} alt="" />
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
</button>
