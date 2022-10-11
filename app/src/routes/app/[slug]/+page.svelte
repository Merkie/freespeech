<script lang="ts">
	import type { Project, Tile, TilePage, User } from '@prisma/client';
	import TileGrid from './components/TileGrid.svelte';
	export let data: Project & { pages: (TilePage & { tiles: Tile[] })[] };
	import { AppProject, InSettingsPage } from '$lib/client/stores';
	import SentenceBuilder from './components/SentenceBuilder.svelte';
	import TileGridHeader from './components/TileGridHeader.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditModeRibbon from './components/EditModeRibbon.svelte';
	import SettingsPage from './components/SettingsPage.svelte';
	import NavigateModal from './components/NavigateModal.svelte';
	import EditorModeColorPicker from './components/EditorModeColorPicker.svelte';
	import TrashWarning from './components/TrashWarning.svelte';
	import TemplateModeInfo from './components/TemplateModeInfo.svelte';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';
	import trpc from '$lib/client/trpc';

	$AppProject = data;

	// On mount, take a pic of the page for the thumbnail
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		if ($AppProject.image) {
			await trpc(fetch).mutation('s3:remove', {
				url: $AppProject.image
			});
		}
		const screenshotTarget = document.body;
		html2canvas(screenshotTarget, { scale: 0.5 }).then(async (canvas) => {
			const image = canvas.toDataURL('image/png');
			const response = await trpc(fetch).mutation('s3:upload', {
				file: JSON.stringify({ blob: image }),
				filename: `${Date.now()}.png`
			});
			if (!response) return;
			await trpc(fetch).mutation('project:set_thumbnail', {
				id: $AppProject.id,
				thumbnail: response
			});
		});
	});
</script>

<main>
	{#if !$InSettingsPage}
		<SentenceBuilder />
		<TileGridHeader />
		<TileGrid />
		<EditModeRibbon />
		<NavigateModal />
		<EditorModeColorPicker />
		<TrashWarning />
		<TemplateModeInfo />
	{:else}
		<SettingsPage />
	{/if}
	<AppNavigation />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
