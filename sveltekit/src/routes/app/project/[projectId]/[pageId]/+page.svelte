<script lang="ts">
	// stores
	import {
		TileBeingEdited,
		EditingTiles,
		LocalSettings,
		UsingOnlineSearch
	} from '$ts/client/stores';
	// components
	import PageHeader from '$components/app/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile } from '@prisma/client';
	import EditTilePanel from '$components/modals/EditTilePanel.svelte';
	import OnlineImageSearchPanel from '$components/modals/OnlineImageSearchPanel.svelte';
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import EditPageModal from '$components/modals/EditPageModal.svelte';
	import CreatePageModal from '$components/modals/CreatePageModal.svelte';
	import UnsavedChangesModal from '$components/modals/UnsavedChangesModal.svelte';
	import { onMount } from 'svelte';
	import * as htmlToImage from 'html-to-image';
	import { uploadFile } from '$ts/client/presigned-uploads.js';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let containerHeight: number; // Needed for CSS tricks
	let containerElement: HTMLElement;

	$: organizedTiles = (() => {
		const newTiles = data.page.tiles.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		if ($EditingTiles) newTiles.push([]);

		return newTiles;
	})();

	onMount(() => {
		if (data.projectId) $LocalSettings.lastVisitedProjectId = data.projectId;

		const captureContainer = async () => {
			// allow page to render
			await new Promise((resolve) => setTimeout(resolve, 500));

			const dataUrl = await htmlToImage.toPng(containerElement, {
				quality: 1
			});

			// Convert data URL to Blob
			const response = await fetch(dataUrl);
			const blob = await response.blob();

			const file = new File([blob], `${data.page.name}.png`, { type: 'image/png' });
			const key = await uploadFile(file);

			await fetch(`/api/v1/project/${data.projectId}/update`, {
				method: 'POST',
				body: JSON.stringify({
					imageUrl: `/${key}`
				})
			});

			await invalidateAll();
		};

		// if the project hasn't been updated in the last 5 minutes, update the image
		if (
			data.project.updatedAt &&
			Date.now() - new Date(data.project.updatedAt).getTime() > 5 * 60 * 1000
		) {
			captureContainer();
		}
	});
</script>

<svelte:head>
	<title>{`${$EditingTiles ? 'Editing:' : ''} ${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<PageHeader pageName={data.page.name} />

{#if !$EditingTiles && $LocalSettings.sentenceBuilder}<SentenceBuilder />{/if}

<div
	bind:this={containerElement}
	bind:clientHeight={containerHeight}
	class="relative flex-1 bg-zinc-100"
>
	<div
		class="absolute overflow-auto"
		style={`height: ${containerHeight}px; width: ${
			$TileBeingEdited ? 'calc(100% - 350px)' : '100%'
		};`}
	>
		{#if containerHeight}
			{#each organizedTiles as pageTiles, pageIndex}
				<TilePage
					{containerHeight}
					subpage={pageIndex}
					tiles={pageTiles}
					columns={data.project.columns}
					rows={data.project.rows}
					projectId={data.project.id}
					pageId={data.page.id}
				/>
			{/each}
		{/if}
	</div>
	{#if $TileBeingEdited}
		<div
			class="absolute right-0 top-0 flex w-[350px] flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-4 text-zinc-200 shadow-md"
			style={`height: ${containerHeight}px;`}
		>
			{#if $UsingOnlineSearch}
				<OnlineImageSearchPanel />
			{:else}
				<EditTilePanel pages={data.projectPages || []} tiles={data.page.tiles} />
			{/if}
		</div>
	{/if}
</div>

{#if data.project}
	<EditPagesModal projectId={data.project.id} pages={data.projectPages} />
	<CreatePageModal projectId={data.project.id} />
	<EditPageModal />
	<UnsavedChangesModal />
{/if}
