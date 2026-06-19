<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { requestBoardRefresh, DraggedTile } from '$ts/client/stores';
	import { moveTile } from '$ts/client/move-tile';

	export let x: number;
	export let y: number;
	export let subpage: number;

	export let projectId: string;

	export let pageId: string;
	export let isHomePage: boolean;

	let dragOver = false;

	async function handleAddTile() {
		await api.tile.create({
			pageId,
			x,
			y,
			page: subpage
		});
		if (isHomePage) void api.project.updateThumbnail(projectId);

		await invalidateAll();
		requestBoardRefresh();
	}

	function handleDragOver(event: DragEvent) {
		if (!$DraggedTile) return;
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
		dragOver = true;
	}

	async function handleDrop(event: DragEvent) {
		if (!$DraggedTile) return;
		event.preventDefault();
		const source = $DraggedTile;
		dragOver = false;
		$DraggedTile = null;
		await moveTile({
			source,
			targetX: x,
			targetY: y,
			targetPage: subpage,
			occupant: null,
			projectId,
			isHomePage
		});
	}
</script>

<button
	style={`grid-row: ${y + 1}; grid-column: ${x + 1};`}
	class={`grid h-full w-full place-items-center rounded-md border border-dashed text-3xl font-light text-zinc-500 ${
		dragOver ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-500' : 'border-zinc-500 bg-zinc-100'
	}`}
	on:click={handleAddTile}
	on:dragover={handleDragOver}
	on:dragleave={() => (dragOver = false)}
	on:drop={handleDrop}
>
	<p>+</p>
</button>
