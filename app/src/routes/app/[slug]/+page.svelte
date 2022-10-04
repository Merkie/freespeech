<script lang="ts">
	// Components
	import AppNavigationButton from './components/AppNavigationButton.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditorRibbon from './components/EditorRibbon.svelte';
	import TileGrid from './components/TileGrid.svelte';
	import SettingsPage from './components/SettingsPage.svelte';
	import EditorToolbox from './components/EditorToolbox.svelte';
	import SentenceBuilder from './components/SentenceBuilder.svelte';


	// Session
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();

	// Icons
	import { Home, Pencil, Cog, Check } from '@steeze-ui/heroicons';

	// types
	import type { Project, TilePage, Tile } from '@prisma/client';
	import TileGridHeader from './components/TileGridHeader.svelte';

	// Stores
	import { CurrentPageIndex,
					ProjectData,
					IsInEditMode,
					EditedTiles,
					InSettingsMenu,
					PageHistory,
					PageHistoryIndex
					} from '$lib/stores';
	import { edit_tile } from '$lib/api/app';

	// Props
	export let data: { project: Project & { pages: TilePage[] & { tiles: Tile[] }[] } };

	// The entire project data object
	$ProjectData = data.project;
	// The current page index in $ProjectData.pages
	$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === 'HOME');

	const save = async () => {
		if($EditedTiles.length > 0) {
			// Send each tile to the server for updates
			$EditedTiles.forEach(async (tile: Tile) => {
				// Set the tile page just incase
				tile.tilePageId = $ProjectData.pages[$CurrentPageIndex].id;

				// Send the tile to the server
				const res = await edit_tile(tile, $session?.access_token+'');
			})

			// reset editedTiles
			$EditedTiles = [];
		}
	}
</script>

<main style={`background-color: ${!$InSettingsMenu ? 'var(--tile-grid-background)' : 'var(--background)'};`}>
	{#if !$InSettingsMenu}
		<SentenceBuilder />
		<TileGridHeader />
		<TileGrid />
		{#if $IsInEditMode}
			<EditorRibbon/>
		{/if}
	{:else}
		<SettingsPage />
	{/if}
</main>

<AppNavigation>
	<AppNavigationButton 
		name={'Home'}
		iconsrc={Home}
		callback={() => {
			$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === 'HOME');
			$InSettingsMenu = false;
			$PageHistory = ['HOME'];
			$PageHistoryIndex = 0;
		}}
	/>
	<AppNavigationButton
		name={$IsInEditMode ? 'Save Changes' : 'Edit'}
		iconsrc={$IsInEditMode ? Check : Pencil}
		background={$IsInEditMode ? 'var(--success)' : 'inital'}
		border={$IsInEditMode ? 'var(--success-border)' : 'inital'}
		callback={() => {if($InSettingsMenu) return; $IsInEditMode = !$IsInEditMode; if(!$IsInEditMode) save()}}
	/>
	<AppNavigationButton
		name={'Settings'}
		iconsrc={Cog}
		callback={() => $InSettingsMenu = true}
	/>
</AppNavigation>

<style>
	main {
    height: calc(100% - 71px);
		max-height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		transition-duration: 0s;
  }
</style>
