<script lang="ts">
	import {
		ActiveDraggingTile,
		CurrentPage,
		CurrentProject,
		ActiveDraggingTilePlace,
		type ProjectExpanded
	} from '$lib/stores';
	import type { Tile } from '$lib/types';
	import { scale } from 'svelte/transition';
	import TileElement from './Tile.svelte';
	export let x: number;
	export let y: number;

	import { addTile } from '$lib/helpers/tileActions';

	const createTile = () => {
		addTile({ tilePage: $CurrentPage, x, y });
	};

	let displayDraggedTile = false;
</script>

<button
	on:click={createTile}
	in:scale={{ duration: 300, delay: Math.random() * 200 }}
	class="border bg-zinc-200 border-zinc-400 border-dashed rounded-sm"
	><i class="bi bi-plus-lg text-zinc-500 text-xl" /></button
>
