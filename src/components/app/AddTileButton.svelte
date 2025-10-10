<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';



	interface Props {
		x: number;
		y: number;
		subpage: number;
		projectId: string;
		pageId: string;
		isHomePage: boolean;
	}

	let {
		x,
		y,
		subpage,
		projectId,
		pageId,
		isHomePage
	}: Props = $props();

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
	onclick={handleAddTile}
>
	<p>+</p>
</button>
