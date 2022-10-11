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
		// Wait 2 seconds
		await new Promise((resolve) => setTimeout(resolve, 2000));
		// Get the old image thumbnail (null if there is none)
		const old_image_url = $AppProject.image;

		//Take a screenshot of the page
		const canvas = await html2canvas(document.body, { scale: 0.5 });

		// Convert the canvas to an image url
		const image = canvas.toDataURL('image/png');
		
		// Upload the image to the server
		const response = await trpc(fetch).mutation('s3:upload', {
			file: JSON.stringify({ blob: image }),
			filename: `${Date.now()}.png`
		});
		if (!response) return;

		// Update the project's thumbnail with the new image
		await trpc(fetch).mutation('project:set_thumbnail', {
			id: $AppProject.id,
			thumbnail: response
		});

		// If there was an old thumbnail, send a request to have it deleted
		if (old_image_url) {
			await trpc(fetch).mutation('s3:remove', {
				url: old_image_url
			});
		}
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
