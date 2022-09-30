<script lang="ts">
	import Tile from './Tile.svelte';
	import AddTileGhost from './AddTileGhost.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import type { Tile as ITile } from '@prisma/client';
	import EditorModal from './EditorModal.svelte';
	export let items: Array<ITile>;

	export let isEditing: boolean;
	export let isEditingDragging: boolean;
	export let isEditingInspect: boolean;

	export let addTile: Function;
	export let updateItems: Function;
	export let updateItem: Function;

	let isEditorModalOpen = false;
	let editorModalTile: ITile;

	const flipDurationMs = 300;
	const handleDndConsider = (e: { detail: any }) => {
		updateItems(e.detail.items);
	};
	const handleDndFinalize = (e: { detail: any }) => {
		updateItems(e.detail.items);
	};

	const inspectorCallback = (tile: Tile) => {
		editorModalTile = tile;
		isEditorModalOpen = true;
	}

	const updateTileCallback = async (tile: Tile) => {
		await updateItem(tile);
	}

	let dropTargetStyle = { opacity: '.5' };
</script>

<section>
	<div
		style={'grid-template-columns: repeat(8, minmax(0, 1fr));'}
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
				<Tile tile={item} {isEditingInspect} {inspectorCallback} />
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
		height: calc(100% - 50px);
	}
	div {
		display: grid;
		grid-gap: 10px;
		padding: 10px;
	}
</style>
