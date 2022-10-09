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
	$AppProject = data;
</script>

<main>
	{#if !$InSettingsPage}
		<SentenceBuilder />
		<TileGridHeader />
		<TileGrid />
		<EditModeRibbon />
		<NavigateModal />
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
