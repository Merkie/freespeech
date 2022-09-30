<script lang="ts">
	// Components
	import AppNavigationButton from './components/AppNavigationButton.svelte';
	import AppNavigation from './components/AppNavigation.svelte';
	import EditorRibbon from './components/EditorRibbon.svelte';
	import TileGrid from './components/TileGrid.svelte';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();

	// API
	import { add_tile, update_tiles } from '$lib/api/app';

	// Icons
	import { Home, Pencil, Cog, Check } from '@steeze-ui/heroicons';

	// types
	import type { Project, TilePage, Tile } from '@prisma/client';

	// Props
	export let data: { project: Project };
	let pages = (data.project as unknown as { pages: Array<any> }).pages;

	interface IState {
		isEditing: boolean;
		isEditingDragging: boolean;
	}

	// State
	let state: IState;
	let isEditing = false;
	let isEditingDragging = false;

	// Get items from the project
	let items = pages[0].tiles.sort((a: Tile, b: Tile) => {
		return a.index - b.index;
	});

	// Adding a new tile
	const handle_tile_add = async () => {
		if(!$session?.access_token) return; 
		items = [...items, {
			id: parseInt(Math.random()*1000+''),
			index: items.length,
			display: 'An unnamed tile'
		}]
		const response = await add_tile(pages[0].id, $session.access_token);
		if (!response.tile) return;
		items[items.length - 1] = response.tile;
	};

	const updateItems = async (newItems: Array<Tile>) => {
		items = newItems;
	};

	const toggleEditing = async () => {
		if (isEditing && $session?.access_token) {
			console.log('Saving tiles...', items);
			// Get list of tiles that need to be updated
			const updates = items.map((item: Tile, index: number) => {
				if (item.index !== index) {
					return {
						id: item.id,
						index
					};
				}
			});
			// Send the updates to the server
			await update_tiles(updates, $session.access_token);
		}
		isEditing = !isEditing;
	};

	$: {
		state = {
			isEditing,
			isEditingDragging
		};
	}
</script>

<TileGrid {...state} addTile={handle_tile_add} {updateItems} {items} />
{#if isEditing}
	<EditorRibbon
		toggleDragging={() => (isEditingDragging = !isEditingDragging)}
		{isEditingDragging}
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
