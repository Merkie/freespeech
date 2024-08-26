<script lang="ts">
	// components
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile } from '$ts/common/types';
	export let data;

	let containerHeight: number; // Needed for CSS tricks

	$: organizedTiles = (() => {
		const newTiles = data.page.tiles!.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		return newTiles;
	})();
</script>

<svelte:head>
	<title>{`${data.page.name} | FreeSpeechAAC`}</title>
</svelte:head>

<div bind:clientHeight={containerHeight} class="pointer-events-none relative flex-1 bg-zinc-100">
	<div class="absolute overflow-auto" style={`height: ${containerHeight}px; width: 100%;`}>
		{#if containerHeight}
			{#each organizedTiles as pageTiles, pageIndex}
				<TilePage
					{containerHeight}
					subpage={pageIndex}
					tiles={pageTiles}
					columns={data.project.columns}
					rows={data.project.rows}
					projectId={data.project.id}
					pageId={data.page.id}
				/>
			{/each}
		{/if}
	</div>
</div>
