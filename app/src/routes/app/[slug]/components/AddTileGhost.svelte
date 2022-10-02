<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';

	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();


	import { IsInEditMode,
					InspectedTile,
					ProjectData,  
					CurrentPageIndex,
				} from '$lib/stores';
	import type { Tile } from '@prisma/client';
	import { create_tile } from '$lib/api/app';

	const handle_tile_add = async () => {
		if(!$session?.access_token) return; 
		const new_tile = ({
			id: parseInt(Math.random().toString().split('.')[1]),
			index: $ProjectData.pages[$CurrentPageIndex].tiles.length,
			display: 'An unnamed tile'
		} as Tile);
		$ProjectData.pages[$CurrentPageIndex].tiles = [...$ProjectData.pages[$CurrentPageIndex].tiles, new_tile]
		const response = await create_tile($ProjectData.pages[$CurrentPageIndex].id, new_tile, $session.access_token);
		if (!response.tile) return;
		$ProjectData.pages[response.tile.index] = response.tile;
	};
</script>

<button on:click={handle_tile_add}>
	<Icon size="20px" src={Plus} />
</button>

<style>
	button {
		width: 100%;
		height: 100px;
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
