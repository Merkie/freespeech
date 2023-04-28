<script lang="ts">
	import { ActiveProject, ActivePage, AppMode } from '$ts/client/stores';
	import type Tile from '$ts/types/Tile';
	import PageHeader from './PageHeader.svelte';
	import TilePage from './TilePage.svelte';

	let containerHeight: number;
	let tiles: Tile[] = [];

	// @ts-ignore
	$: tiles = $ActiveProject?.pages.find((page) => page.name === $ActivePage)?.data.tiles;

	let pagesTiles: Tile[][] = [];

	/**
	 * Removes empty pages from the given pages array and updates the 'page' property
	 * of the tiles in the remaining pages to match their new index.
	 *
	 * @param {Tile[][]} pagesTiles - The array of pages containing tiles.
	 * @returns {Tile[][]} - The refactored array of pages containing tiles.
	 */
	function refactorPagesTiles(pagesTiles: Tile[][]): Tile[][] {
		// Remove empty pages from the pages array
		let refactoredPagesTiles = pagesTiles.filter((page) => page.length > 0);

		// Update the 'page' property of the tiles in the remaining pages
		refactoredPagesTiles.forEach((pageTiles, index) => {
			pageTiles.forEach((tile) => {
				tile.page = index;
			});
		});

		return refactoredPagesTiles;
	}

	// Reactive statement for updating the pagesTiles array
	$: {
		if (tiles) {
			// Find the maximum page number among the tiles
			const maxPage = tiles.reduce((max, tile) => Math.max(max, tile.page || 0), 0);
			// Create an array of pages, each containing the tiles with the respective page number
			pagesTiles = Array.from({ length: maxPage + 1 }, (_, pageIndex) =>
				tiles.filter((tile) => (tile.page === undefined ? 0 : tile.page) === pageIndex)
			);

			// Refactor the pagesTiles array by removing empty pages and updating tile.page values
			pagesTiles = refactorPagesTiles(pagesTiles);

			// If the app is in edit mode, add an empty page for adding new tiles
			if ($AppMode === 'edit') {
				pagesTiles.push([]);
			}
		}
	}
</script>

<PageHeader />
<div bind:clientHeight={containerHeight} class="flex-1 bg-zinc-100 overflow-auto">
	{#each pagesTiles as pageTiles, pageIndex}
		<TilePage {containerHeight} page={pageIndex} tiles={pageTiles} />
	{/each}
</div>
