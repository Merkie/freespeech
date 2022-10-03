<script lang="ts">
	// Icons
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();

	// Stores
	import { ProjectData,  
					CurrentPageIndex,
					UserTileSize
				} from '$lib/stores';
	
	// Types
	import type { Tile } from '@prisma/client';
	
	// API
	import { create_tile } from '$lib/api/app';

	// Add a new tile
	const handle_tile_add = async () => {
		// If no session, return
		if(!$session?.access_token) return; 
		
		// Create new tile
		const new_tile = ({
			id: parseInt(Math.random().toString().split('.')[1]),
			index: $ProjectData.pages[$CurrentPageIndex].tiles.length,
			display: 'An unnamed tile'
		} as Tile);
		
		// Add it to the list
		$ProjectData.pages[$CurrentPageIndex].tiles = [...$ProjectData.pages[$CurrentPageIndex].tiles, new_tile]
		
		// Create the tile in the database
		const response = await create_tile($ProjectData.pages[$CurrentPageIndex].id, new_tile, $session.access_token);
		
		// If there was an error, return
		if (!response.tile) return;
		
		// Update the tile with the new id
		$ProjectData.pages[$CurrentPageIndex].tiles[response.tile.index].id = response.tile.id;
	};
</script>

<button style={`height: ${$UserTileSize}px;`} on:click={handle_tile_add}>
	<Icon size="20px" src={Plus} />
</button>

<style>
	button {
		width: 100%;
		background-color: var(--background);
		border: 1px dashed var(--text);
		color: var(--text);
		padding: 5px;
		border-radius: 5px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}
</style>
