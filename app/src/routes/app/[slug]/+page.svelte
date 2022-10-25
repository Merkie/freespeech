<script lang="ts">
	import type { Project, Tile, TilePage, User } from '@prisma/client';
	import TileGrid from './components/TileGrid.svelte';
	export let data: Project & { pages: (TilePage & { tiles: Tile[] })[] };
	import { AppProject, InSettingsPage, Me } from '$lib/client/stores';
	import AppHeader from './components/AppHeader.svelte';
	import SentenceBuilder from './components/SentenceBuilder.svelte';
	import TileGridHeader from './components/TileGridHeader.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditModeRibbon from './components/EditModeRibbon.svelte';
	import SettingsPage from './components/SettingsPage.svelte';
	import NavigateModal from './components/NavigateModal.svelte';
	import EditorModeColorPicker from './components/EditorModeColorPicker.svelte';
	import TrashWarning from './components/TrashWarning.svelte';
	import CloneProjectModal from './components/CloneProjectModal.svelte';
	import TemplateModeInfo from './components/TemplateModeInfo.svelte';
	import ConjugationWindow from './components/ConjugationWindow.svelte';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';
	import trpc from '$lib/client/trpc';
	import TextEditorPopup from './components/TextEditorPopup.svelte';
	import Spinner from '$lib/client/components/Spinner.svelte';

	$AppProject = data;

	// On mount, take a pic of the page for the thumbnail
	onMount(async () => {
		if ($AppProject.userId != $Me.id) return;
		// Wait 2 seconds
		await new Promise((resolve) => setTimeout(resolve, 100));
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
		await trpc(fetch).mutation('project:edit', {
			id: $AppProject.id,
			image: response
		});

		// If there was an old thumbnail, send a request to have it deleted
		if (old_image_url) {
			await trpc(fetch).mutation('s3:remove', {
				url: old_image_url
			});
		}
	});
</script>

<svelte:head>
	<title>App - FreeSpeech</title>
</svelte:head>

<main>
	{#if !$InSettingsPage}
		<AppHeader />
		<SentenceBuilder />
		<TileGridHeader />
		<TileGrid />
		<EditModeRibbon />
		<NavigateModal />
		<EditorModeColorPicker />
		<TrashWarning />
		<TemplateModeInfo />
		<CloneProjectModal />
		<TextEditorPopup />
		<ConjugationWindow />
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
