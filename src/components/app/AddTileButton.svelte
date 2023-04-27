<script lang="ts">
	import { ActivePage, ActiveProject } from '$ts/client/stores';

	export let x: number;
	export let y: number;

	const addTile = () => {
		if (!$ActiveProject) return;
		const currentPageIndex = $ActiveProject.pages.findIndex((page) => page.name === $ActivePage);
		if (currentPageIndex === -1) return;
		if (!$ActiveProject.pages[currentPageIndex]) return;

		($ActiveProject.pages[currentPageIndex].data as unknown as { tiles: any[] }).tiles = [
			...($ActiveProject.pages[currentPageIndex].data as unknown as { tiles: any[] }).tiles,
			{ x, y, text: 'New tile' }
		];
	};
</script>

<button
	on:click={addTile}
	style={`grid-row: ${y + 1}; grid-column: ${x + 1};`}
	class={`w-full h-fullborder rounded-md bg-zinc-100 grid place-items-center border border-dashed border-zinc-500 text-zinc-500 text-3xl font-light`}
>
	<p>+</p>
</button>
