<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';

	export let x: number;
	export let y: number;
	export let subpage: number;

	export let projectId: string;

	export let pageId: string;
	export let isHomePage: boolean;

	async function handleAddTile() {
		await api.tile.create({
			pageId,
			x,
			y,
			page: subpage
		});
		if (isHomePage) void api.project.updateThumbnail(projectId);

		await invalidateAll();
	}
</script>

<button
	style={`grid-row: ${y + 1}; grid-column: ${x + 1};`}
	class={`grid h-full w-full place-items-center rounded-md border border-dashed border-zinc-500 bg-zinc-100 text-3xl font-light text-zinc-500`}
	on:click={handleAddTile}
>
	<p>+</p>
</button>
