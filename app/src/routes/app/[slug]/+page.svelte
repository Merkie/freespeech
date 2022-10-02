<script lang="ts">
	// Components
	import AppNavigationButton from './components/AppNavigationButton.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditorRibbon from './components/EditorRibbon.svelte';
	import TileGrid from './components/TileGrid.svelte';

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
					EditedTiles
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

<TileGridHeader />
<TileGrid />
{#if $IsInEditMode}
	<EditorRibbon/>
{/if}
<AppNavigation>
	<AppNavigationButton 
		name={'Home'}
		iconsrc={Home}
		callback={() => console.log('Home pressed')}
	/>
	<AppNavigationButton
		name={$IsInEditMode ? 'Save Changes' : 'Edit'}
		iconsrc={$IsInEditMode ? Check : Pencil}
		background={$IsInEditMode ? 'var(--success)' : 'inital'}
		callback={() => {$IsInEditMode = !$IsInEditMode; if(!$IsInEditMode) save()}}
	/>
	<AppNavigationButton
		name={'Settings'}
		iconsrc={Cog}
		callback={() => console.log('Settings pressed')}
	/>
</AppNavigation>
