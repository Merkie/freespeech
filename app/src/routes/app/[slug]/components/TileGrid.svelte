<script lang="ts">
	// @ts-nocheck

	// Util
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	// Types
	import type { Tile as ITile } from '@prisma/client';

	// Components
	import EditorModal from './EditorModal.svelte';
	import EditorToolbox from './EditorToolbox.svelte';
	import Tile from './Tile.svelte';
	import AddTileGhost from './AddTileGhost.svelte';
	

	// Stores
	import { IsInEditMode,
					InspectedTile,
					ProjectData,  
					CurrentPageIndex,
					IsEditingDragging,
					UserTileSize
				} from '$lib/stores';

	// API
	import { reorder_page } from '$lib/api/app';

	// Session
	import { getSession } from 'lucia-sveltekit/client';
	let session = getSession();

	// Items is needed for drag and drop functionality
	let items = $ProjectData.pages[$CurrentPageIndex].tiles.sort((a, b) => a.index - b.index);

	// Considering a Dnd action
	const handleDndConsider = async (e: { detail: any }) => {
		items = e.detail.items;
	};
	
	// Finalizing a Dnd action
	const handleDndFinalize = async (e: { detail: any }) => {
		items = e.detail.items.map((item: ITile, index: number) => {
			item.index = index;
			return item;
		});
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
		await reorder_page($ProjectData.pages[$CurrentPageIndex].id, updates, $session.access_token);
	};

	// Set the items to the store
	$: {
			items = $ProjectData.pages[$CurrentPageIndex].tiles.sort((a, b) => a.index - b.index);
	}
</script>

<section style={"--tile-height: "+$UserTileSize+"px; --num-rows: "+parseInt(`${$ProjectData.pages[$CurrentPageIndex].tiles.length/$ProjectData.pages[$CurrentPageIndex].columns}`)+';'}>
	<div
		use:dndzone={{ items, flipDurationMs: 300, dropTargetStyle: { opacity: '.5' }, dragDisabled: !$IsEditingDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<span
				animate:flip={{
					duration: 300
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
			<EditorToolbox />
		{/if}
	</div>
</section>

<style>
	section {
		background-color: var(--tile-grid-background);
		flex: 1;
		overflow-y: scroll;
	}
	div {
		grid-template-columns: repeat(8, calc(100% / 8));
		display: grid;
		grid-gap: 10px;
		padding: 10px;
	}
</style>
