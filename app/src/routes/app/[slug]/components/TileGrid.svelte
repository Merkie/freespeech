<script lang="ts">
	import Tile from './Tile.svelte';
	import AddTileGhost from './AddTileGhost.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import type { Tile as ITile } from '@prisma/client';
	import EditorModal from './EditorModal.svelte';
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();
	// export let items: Array<ITile>;

	import { IsInEditMode,
					InspectedTile,
					ProjectData,  
					CurrentPageIndex,
					IsEditingDragging
				} from '$lib/stores';
	import { reorder_page } from '$lib/api/app';

	let items = $ProjectData.pages[$CurrentPageIndex].tiles.sort((a, b) => a.index - b.index);

	const flipDurationMs = 300;
	
	// Considering a Dnd action
	const handleDndConsider = (e: { detail: any }) => {
		items = e.detail.items;
	};
	
	// Finalizing a Dnd action
	const handleDndFinalize = async (e: { detail: any }) => {
		items = e.detail.items;
		$ProjectData.pages[$CurrentPageIndex].tiles = items;
		
		const updates = e.detail.items.map((item: ITile, index: number) => {
				if(item.index !== index) {
					return {
						id: item.id,
						index: index
					}
				}
		});

		if(!$session?.access_token) return;
		console.log(updates);
		await reorder_page($ProjectData.pages[$CurrentPageIndex].id, updates, $session.access_token);
	};

	// Style of the dropzone when moving a tile
	let dropTargetStyle = { opacity: '.5' };

	$: {
		items = $ProjectData.pages[$CurrentPageIndex].tiles.sort((a, b) => a.index - b.index);
	}
</script>

<section>
	<div
		style={'grid-template-columns: repeat('+$ProjectData.pages[$CurrentPageIndex].columns+', minmax(0, 1fr));'}
		use:dndzone={{ items, flipDurationMs, dropTargetStyle, dragDisabled: !$IsEditingDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<span
				animate:flip={{
					duration: flipDurationMs
				}}
			>
				<Tile tile={item} />
			</span>
		{/each}

		{#if $IsInEditMode}
			<AddTileGhost />
		{/if}

		{#if $InspectedTile}
	 		<EditorModal />
		{/if}
	</div>
</section>

<style>
	section {
		background-color: var(--background);
		height: calc(100% - 200px);
	}
	div {
		display: grid;
		grid-gap: 10px;
		padding: 10px;
	}
</style>
