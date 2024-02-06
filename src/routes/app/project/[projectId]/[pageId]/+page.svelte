<script lang="ts">
	// stores
	import { isEditing, LocalSettings } from '$ts/client/stores';
	// components
	import PageHeader from '$components/app/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile } from '@prisma/client';

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

	const organizedTiles: Tile[][] = data.page.tiles.reduce((acc: Tile[][], tile: Tile) => {
		acc[tile.page] = acc[tile.page] || [];
		acc[tile.page].push(tile);
		return acc;
	}, []);
</script>

<svelte:head>
	<title>{`${$isEditing ? 'Editing:' : ''} ${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<PageHeader />

{#if !$isEditing && $LocalSettings.sentenceBuilder}<SentenceBuilder {speakText} />{/if}

<div bind:clientHeight={containerHeight} class="flex-1 overflow-auto bg-zinc-100">
	{#if containerHeight}
		{#each organizedTiles as pageTiles, pageIndex}
			<TilePage {speakText} {containerHeight} subpage={pageIndex} tiles={pageTiles} />
		{/each}
	{/if}
</div>
