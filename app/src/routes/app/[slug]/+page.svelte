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

	$ProjectData = data.project;

	let currentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === 'HOME');

	// Get items from the project
	let items = $ProjectData.pages[currentPageIndex].tiles.sort((a: Tile, b: Tile) => {
		return a.index - b.index;
	});

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
		console.log('Saving tiles...', editedTiles);

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
		} else {
			console.log('No tiles to update');
		}

		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Reset the state
		const response = await fetch_project($ProjectData.id, $session?.access_token+'');
		if(response.project) {
			console.log('Non-updated project', $ProjectData);
			$ProjectData = response.project;
			console.log('Updated project', $ProjectData);
			console.log('Response', response.project);
		}
	}

	const toggleEditing = async () => {
		isEditing = !isEditing;
		if (!isEditing) {
			await save();
		}
	};

	const navigateCallback = async (navigation: string) => {
		console.log('Navigating to', navigation);
		console.log('Pages: ', $ProjectData.pages.map((page) => page.name));

		const newIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === navigation.toUpperCase());

		if (newIndex !== -1) {
			currentPageIndex = newIndex;
			items = $ProjectData.pages[currentPageIndex].tiles.sort((a: Tile, b: Tile) => {
				return a.index - b.index;
			});
		} else { 
			if(!$session) return;
			console.log('Creating new page...');
			const response = await create_page($ProjectData.id, navigation, $session.access_token);
			console.log(response);
			if (!response.page) return;
			$ProjectData.pages = [...$ProjectData.pages, response.page];
			currentPageIndex = $ProjectData.pages.length - 1;
			items = $ProjectData.pages[currentPageIndex].tiles.sort((a: Tile, b: Tile) => {
				return a.index - b.index;
			});
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

	$: {
		state = {
			isEditing,
			isEditingInspect,
			isEditingDragging,
			isEditingColor
		};
	}
</script>

<TileGrid {...state} addTile={handle_tile_add} columns={$ProjectData.pages[currentPageIndex].columns} {reorderPage} {updateItems} {updateItem} {items} {navigateCallback} />
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
	<AppNavigationButton name={'Home'} iconsrc={Home} callback={() => console.log('Home pressed')} />
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
