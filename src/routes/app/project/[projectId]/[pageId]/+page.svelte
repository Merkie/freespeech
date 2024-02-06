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

	export let data;

	let containerHeight: number; // Needed for CSS tricks

	const speakText = async (text: string) => {
		if (text.trim() === '') return;

		const utterance = new SpeechSynthesisUtterance(text);
		if ($LocalSettings.offlineVoice) {
			utterance.voice =
				speechSynthesis.getVoices().find((voice) => voice.name === $LocalSettings.offlineVoice) ||
				null;
		}
		utterance.lang = 'en-US';
		speechSynthesis.speak(utterance);
	};

	$: organizedTiles = (() => {
		const newTiles = data.page.tiles.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		if ($EditingTiles) newTiles.push([]);

		return newTiles;
	})();
</script>

<svelte:head>
	<title>{`${$EditingTiles ? 'Editing:' : ''} ${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<PageHeader pageName={data.page.name} />

{#if !$EditingTiles && $LocalSettings.sentenceBuilder}<SentenceBuilder {speakText} />{/if}

<div bind:clientHeight={containerHeight} class="relative flex-1 bg-zinc-100">
	<div
		class="absolute overflow-auto"
		style={`height: ${containerHeight}px; width: ${
			$TileBeingEdited ? 'calc(100% - 350px)' : '100%'
		};`}
	>
		{#if containerHeight && data.page.Project}
			{#each organizedTiles as pageTiles, pageIndex}
				<TilePage
					{speakText}
					{containerHeight}
					subpage={pageIndex}
					tiles={pageTiles}
					columns={data.page.Project.columns}
					rows={data.page.Project.rows}
					projectId={data.page.Project.id}
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
				<EditTilePanel pages={data.page.Project?.pages || []} tiles={data.page.tiles} />
			{/if}
		</div>
	{/if}
</div>

{#if data.page.Project}
	<EditPagesModal projectId={data.page.Project.id} pages={data.page.Project.pages} />
	<CreatePageModal projectId={data.page.Project.id} />
	<EditPageModal />
	<UnsavedChangesModal />
{/if}
