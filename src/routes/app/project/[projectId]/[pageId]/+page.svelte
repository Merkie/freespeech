<script lang="ts">
	// stores
	import { TileBeingEdited, isEditing, LocalSettings } from '$ts/client/stores';
	// components
	import PageHeader from '$components/app/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile } from '@prisma/client';
	import EditTilePanel from '$components/modals/EditTilePanel.svelte';

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

	$: organizedTiles = data.page.tiles.reduce((acc: Tile[][], tile: Tile) => {
		acc[tile.page] = acc[tile.page] || [];
		acc[tile.page].push(tile);
		return acc;
	}, []) as Tile[][];
</script>

<svelte:head>
	<title>{`${$isEditing ? 'Editing:' : ''} ${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<PageHeader />

{#if !$isEditing && $LocalSettings.sentenceBuilder}<SentenceBuilder {speakText} />{/if}

<div bind:clientHeight={containerHeight} class="relative flex-1 bg-zinc-100">
	<div
		class="absolute overflow-auto"
		style={`height: ${containerHeight}px; width: ${
			$TileBeingEdited ? 'calc(100% - 400px)' : '100%'
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
		<EditTilePanel {containerHeight} />
	{/if}
</div>
