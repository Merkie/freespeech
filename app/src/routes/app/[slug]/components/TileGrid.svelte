<script lang="ts">
	import Tile from './Tile.svelte';
	import AddTileGhost from './AddTileGhost.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import type { Tile as ITile } from '@prisma/client';
	import EditorModal from './EditorModal.svelte';
	export let items: Array<ITile>;

	export let columns: number;

	export let isEditing: boolean;
	export let isEditingDragging: boolean;
	export let isEditingInspect: boolean;

	export let addTile: Function;
	export let updateItems: Function;
	export let updateItem: Function;
	export let navigateCallback: Function;
	export let reorderPage: Function;
	export let addToSentence: Function;

	let isEditorModalOpen = false;
	let editorModalTile: ITile;

	const flipDurationMs = 300;
	const handleDndConsider = (e: { detail: any }) => {
		updateItems(e.detail.items);
	};
	
	const handleDndFinalize = (e: { detail: any }) => {
		updateItems(e.detail.items);
		
		const updates = e.detail.items.map((item: ITile, index: number) => {
				if(item.index !== index) {
					return {
						id: item.id,
						index: index
					}
				}
		});

		reorderPage(updates);
	};

	const inspectorCallback = (tile: ITile) => {
		editorModalTile = tile;
		isEditorModalOpen = true;
	}

	const updateTileCallback = async (tile: ITile) => {
		await updateItem(tile);
	}

	let dropTargetStyle = { opacity: '.5' };
</script>

<section>
	<div
		style={'grid-template-columns: repeat('+columns+', minmax(0, 1fr));'}
		use:dndzone={{ items, flipDurationMs, dropTargetStyle, dragDisabled: !isEditingDragging }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<span
				animate:flip={{
					duration: flipDurationMs
				}}
			>
				<Tile tile={item} {addToSentence} {isEditing} {isEditingInspect} {inspectorCallback} {navigateCallback} />
			</span>
		{/each}

		{#if isEditing}
			<AddTileGhost callback={addTile} />
		{/if}

		{#if isEditorModalOpen}
	 		<EditorModal tile={editorModalTile} {updateTileCallback} closeModalCallback={() => (isEditorModalOpen = false)} />
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
