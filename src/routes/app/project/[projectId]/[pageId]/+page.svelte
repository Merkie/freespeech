<script lang="ts">
	// stores
	import {
		TileBeingEdited,
		EditingTiles,
		LocalSettings,
		UsingOnlineSearch,
		Sentence,
		ProjectPages,
		ProjectPagesLoading
	} from '$ts/client/stores';
	// components
	import PageHeader from '~/routes/app/project/[projectId]/[pageId]/_components/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile } from '$ts/common/types';
	import EditTilePanel from '$components/modals/EditTilePanel.svelte';
	import OnlineImageSearchPanel from '$components/modals/OnlineImageSearchPanel.svelte';
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import EditPageModal from '$components/modals/EditPageModal.svelte';
	import CreatePageModal from '$components/modals/CreatePageModal.svelte';
	import UnsavedChangesModal from '$components/modals/UnsavedChangesModal.svelte';
	import { onMount } from 'svelte';
	import api from '$ts/client/api';

	export let data;

	let containerHeight: number; // Needed for CSS tricks

	$: organizedTiles = (() => {
		const newTiles = data.page.tiles!.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		if ($EditingTiles) newTiles.push([]);

		return newTiles;
	})();

	// Fetch project pages when entering edit mode
	async function fetchProjectPages() {
		if ($ProjectPages.length > 0 || $ProjectPagesLoading) return;
		$ProjectPagesLoading = true;
		try {
			const { pages } = await api.project.listPages(data.project.id);
			$ProjectPages = pages;
		} finally {
			$ProjectPagesLoading = false;
		}
	}

	$: if ($EditingTiles) {
		fetchProjectPages();
	}

	onMount(() => {
		if (data.projectId) $LocalSettings.lastVisitedProjectId = data.projectId;
		if (data.page?.id) $LocalSettings.lastVisitedPageId = data.page.id;
		$Sentence = [];
		$ProjectPages = []; // Reset pages when navigating to a new page
	});
</script>

<svelte:head>
	<title>{`${$EditingTiles ? 'Editing:' : ''} ${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<PageHeader page={data.page} />

{#if !$EditingTiles && $LocalSettings.sentenceBuilder}<SentenceBuilder />{/if}

<div bind:clientHeight={containerHeight} class="relative flex-1 bg-zinc-100">
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
					isHomePage={data.isHomePage}
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
				<EditTilePanel
					pages={$ProjectPages}
					tiles={data.page.tiles}
					projectId={data.project.id}
					isHomePage={data.isHomePage}
				/>
			{/if}
		</div>
	{/if}
</div>

{#if data.project}
	<EditPagesModal projectId={data.project.id} pages={$ProjectPages} />
	<CreatePageModal projectId={data.project.id} />
	<EditPageModal />
	<UnsavedChangesModal />
{/if}
