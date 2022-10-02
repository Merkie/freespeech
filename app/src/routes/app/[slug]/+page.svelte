<script lang="ts">
	// Components
	import AppNavigationButton from './components/AppNavigationButton.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditorRibbon from './components/EditorRibbon.svelte';
	import TileGrid from './components/TileGrid.svelte';

	import { ProjectData } from '$lib/stores';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();

	// API
	import { create_tile, create_page, reorder_page, edit_tile, fetch_project, edit_page } from '$lib/api/app';

	// Icons
	import { Home, Pencil, Cog, Check } from '@steeze-ui/heroicons';

	// types
	import type { Project, TilePage, Tile } from '@prisma/client';
	import TileGridHeader from './components/TileGridHeader.svelte';

	// Props
	export let data: { project: Project & { pages: TilePage[] & { tiles: Tile[] }[] } };

	// State
	let state: {
		isEditing: boolean;
		isEditingInspect: boolean;
		isEditingDragging: boolean;
		isEditingColor: boolean;
	};
	let isEditing = false;
	let isEditingInspect = false;
	let isEditingDragging = false;
	let isEditingColor = false;
	let editedTiles: Tile[] = [];
	let sentence: Tile[] = [];

	$ProjectData = data.project;

	let currentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === 'HOME');

	// Get items from the project
	let items = $ProjectData.pages[currentPageIndex].tiles.sort((a: Tile, b: Tile) => {
		return a.index - b.index;
	});

	let pageHistory = ['HOME'];
	let pageHistoryIndex = 0;

	// Adding a new tile
	const handle_tile_add = async () => {
		if(!$session?.access_token) return; 
		const new_tile = ({
			id: parseInt(Math.random().toString().split('.')[1]),
			index: items.length,
			display: 'An unnamed tile'
		} as Tile);
		items = [...items, new_tile]
		const response = await create_tile($ProjectData.pages[currentPageIndex].id, new_tile, $session.access_token);
		if (!response.tile) return;
		items[response.tile.index] = response.tile;
	};

	const updateItems = async (newItems: Array<Tile>) => {
		items = newItems;
	};

	const updateItem = async (tile: Tile) => {
		if(!$session?.access_token) return;

		items = items.map((item) => {
			if (item.id === tile.id) {
				return tile;
			}
			return item;
		});

		// Remove the tile from editedTiles if its there
		editedTiles = editedTiles.filter((item) => {
			return item.id !== tile.id;
		});

		// Add it to the list
		editedTiles = [...editedTiles, tile];
	};

	const save = async () => {
		if(editedTiles.length > 0) {
			// Send each tile to the server for updates
			editedTiles.forEach(async (tile: Tile) => {
				// Set the tile page just incase
				tile.tilePageId = $ProjectData.pages[currentPageIndex].id;

				// Send the tile to the server
				const res = await edit_tile(tile, $session?.access_token+'');
				console.log('Saved tile', res);
			})

			// reset editedTiles
			editedTiles = [];
		}

		// Wait 3 seconds before getting the page again
		// This will not result in lost data, im just waiting because sometimes the DB can take
		// a while to update the user's data.
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Reset the state from the server
		// This will clear any old data that was not updated/saved
		const response = await fetch_project($ProjectData.id, $session?.access_token+'');
		if(response.project) $ProjectData = response.project;
	}

	const toggleEditing = async () => {
		isEditing = !isEditing;
		// If we just turned editing off, save the tiles
		if (!isEditing) {
			await save();
		}
	};

	const navigateCallback = async (navigation: string) => {
		// Reset page history index to 0
		pageHistoryIndex = 0;

		// Get the new index of the page based on the name of the navigation
		const newIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === navigation.toUpperCase());
		
		// Checking to see if the page exists, if it doesnt we have to create one
		if (newIndex !== -1) {
			// If it does exist just set the currentPageIndex to the new index
			currentPageIndex = newIndex;

			// Add the page to the pageHistory
			pageHistory = [$ProjectData.pages[currentPageIndex].name, ...pageHistory];
		} else { 
			// If it doesnt exist we have to create a new page

			// Send create_page request to the server
			const response = await create_page($ProjectData.id, navigation, $session?.access_token+'');
			if (!response.page) return;
			
			// Add the page to ProjectData
			$ProjectData.pages = [...$ProjectData.pages, response.page];
			
			// Set the currentPageIndex to the new index
			currentPageIndex = $ProjectData.pages.length - 1;

			// Add the page to the pageHistory
			pageHistory = [$ProjectData.pages[currentPageIndex].name, ...pageHistory];
		}
	};

	const reorderPage = async (newItems: Tile[]) => {
		if(!$session?.access_token) return;
		await reorder_page($ProjectData.pages[currentPageIndex].id, newItems, $session.access_token);
	};

	const editPageColumns = async (columns: number) => {
		console.log(columns)
		$ProjectData.pages[currentPageIndex].columns = columns;

		if(!$session?.access_token) return;
		let page = $ProjectData.pages[currentPageIndex];
		// @ts-ignore
		delete page.tiles;
		const response = await edit_page(page, $session.access_token);
	};

	const navigateBackwards = async () => {
		pageHistoryIndex += 1;
		if (pageHistoryIndex > pageHistory.length - 1) {
			pageHistoryIndex = pageHistory.length - 1;
		}
		currentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === pageHistory[pageHistoryIndex].toUpperCase());
	}

	const navigateForwards = async () => {
		pageHistoryIndex -= 1;
		if (pageHistoryIndex < 0) {
			pageHistoryIndex = 0;
		}
		currentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === pageHistory[pageHistoryIndex].toUpperCase());
	}

	const addToSentence = async (tile: Tile) => {
		sentence = [...sentence, tile];
	}

	const deleteSentence = () => {
		speechSynthesis.cancel();
		sentence = [];
	}

	const removeFromSentence = (tile: Tile) => {
		sentence = sentence.filter((item) => {
			return item.id !== tile.id;
		});
	}

	$: {
		items; // needed to trigger the update
		state = {
			isEditing,
			isEditingInspect,
			isEditingDragging,
			isEditingColor
		};
		try {
			items = $ProjectData.pages[currentPageIndex].tiles.sort((a: Tile, b: Tile) => {
				return a.index - b.index;
			});
		}
		catch(e) {}
		
	}
</script>

<TileGridHeader
	{navigateBackwards}
	{navigateForwards} 
	{removeFromSentence}
	{deleteSentence}
	{sentence}
	pageName={$ProjectData.pages[currentPageIndex].name}
	canNavigateBackwards={(pageHistory.length > 1 && pageHistoryIndex < pageHistory.length-1)}
	canNavigateForwards={(pageHistory.length > 1 && pageHistoryIndex > 0)}
/>
<TileGrid 
	{...state}
	addTile={handle_tile_add}
	columns={$ProjectData.pages[currentPageIndex].columns}
	{reorderPage} 
	{updateItems}
	{updateItem}
	{items}
	{navigateCallback}
	{addToSentence}
/>
{#if isEditing}
	<EditorRibbon
		toggleInspect={() => (isEditingInspect = !isEditingInspect)}
		toggleDragging={() => (isEditingDragging = !isEditingDragging)}
		toggleColor={() => (isEditingColor = !isEditingColor)}
		{editPageColumns}
		pageColumns={$ProjectData.pages[currentPageIndex].columns}
		{...state}
	/>
{/if}
<AppNavigation>
	<AppNavigationButton 
		name={'Home'}
		iconsrc={Home}
		callback={() => console.log('Home pressed')}
	/>
	<AppNavigationButton
		name={isEditing ? 'Save Changes' : 'Edit'}
		iconsrc={isEditing ? Check : Pencil}
		background={isEditing ? 'var(--success)' : 'inital'}
		callback={toggleEditing}
	/>
	<AppNavigationButton
		name={'Settings'}
		iconsrc={Cog}
		callback={() => console.log('Settings pressed')}
	/>
</AppNavigation>
