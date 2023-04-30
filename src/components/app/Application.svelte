<script lang="ts">
	import { ActiveProject, ActivePage, AppMode } from '$ts/client/stores';

	import type Tile from '$ts/types/Tile';
	import PageHeader from './PageHeader.svelte';
	import TilePage from './TilePage.svelte';
	import { onMount } from 'svelte';

	import * as htmlToImage from 'html-to-image';
	import ImageResize from 'image-resize';

	let containerHeight: number;
	let tiles: Tile[] = [];

	// @ts-ignore
	$: tiles = $ActiveProject?.pages.find((page) => page.name === $ActivePage)?.data.tiles;

	let organizedTiles: Tile[][] = [];

	// removes the empty subpages to avoid void pages between pages with tiles
	// also updates the subpage indexs if edits are made
	const removeEmptySubpagesAndUpdateSubpageIndex = (pagesTiles: Tile[][]): Tile[][] => {
		// remove empty subpages
		let updatedPagesTiles = pagesTiles.filter((page) => page.length > 0);

		// update subpage index
		updatedPagesTiles.forEach((pageTiles, index) => {
			pageTiles.forEach((tile) => {
				// TODO: change .page to .subpage
				tile.page = index;
			});
		});

		return updatedPagesTiles;
	};

	let node: HTMLElement;

	const imageResize = new ImageResize({
		format: 'png',
		width: 500,
		height: 500
	});

	onMount(async () => {
		if ($ActiveProject?.imageUrl) {
			const lastThumbnailUploadedDate = $ActiveProject.imageUrl.split('/').pop()?.split('-')[0];
			// time in seconds since last thumbnail upload
			const timeSinceLastThumbnailUpload =
				(Date.now() - parseInt(lastThumbnailUploadedDate + '')) / 1000;

			if (timeSinceLastThumbnailUpload < 200) return;
		}

		const oldImageUrl = $ActiveProject?.imageUrl;

		// capture the node with html-to-image
		const image = await imageResize.play(await htmlToImage.toPng(node));

		const mediaUploadResponse = await fetch('/api/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: 'project-thumbnail.png',
				base64data: (image + '').split(',')[1]
			})
		});

		const mediaUploadResponseJson = await mediaUploadResponse.json();

		if (!mediaUploadResponseJson.fileurl) {
			console.error('Failed to upload thumbnail');
			return;
		}

		const projectUpdateResponse = await fetch('/api/project/update/thumbnail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: $ActiveProject?.id,
				imageUrl: mediaUploadResponseJson.fileurl
			})
		});

		// Delete last image
		await fetch('/api/media/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: oldImageUrl })
		});

		console.log("Updated project's thumbnail");
	});

	$: {
		if (tiles) {
			const maxSubpage = tiles.reduce((max, tile) => Math.max(max, tile.page || 0), 0);
			let pages = Array.from({ length: maxSubpage + 1 }, (_, pageIndex) =>
				tiles.filter((tile) => (tile.page === undefined ? 0 : tile.page) === pageIndex)
			);

			organizedTiles = removeEmptySubpagesAndUpdateSubpageIndex(pages);

			// add an empty subpage if in edit mode
			if ($AppMode === 'edit') {
				organizedTiles.push([]);
			}
		}
	}
</script>

<PageHeader />
<div bind:this={node} bind:clientHeight={containerHeight} class="flex-1 bg-zinc-100 overflow-auto">
	{#each organizedTiles as pageTiles, pageIndex}
		<TilePage {containerHeight} page={pageIndex} tiles={pageTiles} />
	{/each}
</div>
