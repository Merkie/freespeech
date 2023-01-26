<script lang="ts">
	import {
		ActiveDraggingTile,
		CurrentPage,
		CurrentProject,
		ActiveDraggingTilePlace,
		type ProjectExpanded
	} from '$lib/stores';
	import type { Tile } from '@prisma/client';
	import { scale } from 'svelte/transition';
	import TileElement from './Tile.svelte';
	export let x: number;
	export let y: number;

	const createTile = () => {
		$CurrentProject?.pages
			.find((page) => page.name === $CurrentPage)
			?.tiles.push({
				x,
				y,
				text: 'New Tile'
			} as Tile);

		$CurrentProject = { ...$CurrentProject } as ProjectExpanded;
	};

	let displayDraggedTile = false;
</script>

{#if displayDraggedTile && $ActiveDraggingTile && $ActiveDraggingTilePlace.x === x && $ActiveDraggingTilePlace.y === y}
	<TileElement tile={$ActiveDraggingTile} />
{:else}
	<button
		on:dragenter={() => {
			displayDraggedTile = true;
			$ActiveDraggingTilePlace = { x, y };
		}}
		on:dragleave={() => (displayDraggedTile = false)}
		on:drop={() => {
			displayDraggedTile = false;
			$ActiveDraggingTilePlace = { x: undefined, y: undefined };
			$ActiveDraggingTile = undefined;
		}}
		in:scale={{ duration: 300, delay: Math.random() * 200 }}
		out:scale|local={{ duration: 0 }}
		class="border bg-zinc-200 border-zinc-400 border-dashed rounded-sm"
		><i class="bi bi-plus-lg text-zinc-500 text-xl" /></button
	>
{/if}
