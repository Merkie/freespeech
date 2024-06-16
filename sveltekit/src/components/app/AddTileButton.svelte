<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let x: number;
	export let y: number;
	export let subpage: number;

	export let pageId: string;

	async function handleAddTile() {
		await fetch(`/api/v1/tile/create`, {
			method: 'POST',
			body: JSON.stringify({
				x,
				y,
				page: subpage,
				pageId
			})
		});

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
