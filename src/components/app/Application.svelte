<script lang="ts">
	import { ActiveProject, ActivePage, isEditing } from '$ts/client/stores';
	import type Tile from '$ts/types/Tile';
	import PageHeader from './PageHeader.svelte';
	import TilePage from './TilePage.svelte';
	import { onMount } from 'svelte';

	import * as htmlToImage from 'html-to-image';
	import ImageResize from 'image-resize';
	import SentenceBuilder from './SentenceBuilder.svelte';

	import {
		ElevenLabsVoice,
		OfflineVoice,
		VoiceGenerator,
		isSynthesizingSpeech
	} from '$ts/client/stores';

	let containerHeight: number;

	import ElevenLabsVoices from '$ts/types/ElevenLabsVoices';

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
		await new Promise((resolve) => setTimeout(resolve, 500));
		// if the thumbnail was uploaded less than 200 seconds ago, don't update it
		if ($ActiveProject?.imageUrl) {
			const lastThumbnailUploadedDate = $ActiveProject.imageUrl.split('/').pop()?.split('-')[0];
			// time in seconds since last thumbnail upload
			const timeSinceLastThumbnailUpload =
				(Date.now() - parseInt(lastThumbnailUploadedDate + '')) / 1000;

			if (timeSinceLastThumbnailUpload < 200) return;
		}

		// save the old image url so we can delete it later
		const oldImageUrl = $ActiveProject?.imageUrl;

		// capture the node with html-to-image
		const image = await imageResize.play(await htmlToImage.toPng(node));

		// upload the image to the server
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

		// upload error handling
		if (!mediaUploadResponseJson.fileurl) {
			console.error('Failed to upload thumbnail');
			return;
		}

		// update the project with the new thumbnail
		const projectUpdatePromise = fetch('/api/project/update/thumbnail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: $ActiveProject?.id,
				imageUrl: mediaUploadResponseJson.fileurl
			})
		});

		// delete the old thumbnail
		const deleteImagePromise = fetch('/api/media/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: oldImageUrl })
		});

		// run both promises at the same time
		await Promise.all([projectUpdatePromise, deleteImagePromise]);
	});

	const speakText = async (text: string) => {
		if (text.trim() === '') return;
		if ($VoiceGenerator === 'offline') {
			const utterance = new SpeechSynthesisUtterance(text);
			if ($OfflineVoice) {
				utterance.voice =
					speechSynthesis.getVoices().find((voice) => voice.name === $OfflineVoice) || null;
			}
			utterance.lang = 'en-US';
			speechSynthesis.speak(utterance);
		} else if ($VoiceGenerator === 'elevenlabs') {
			if ($isSynthesizingSpeech) return;
			$isSynthesizingSpeech = true;
			const elevenLabsResponse = await fetch('/api/text-to-speech/elevenlabs/speak', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text,
					name: $ElevenLabsVoice || ElevenLabsVoices[0].name
				})
			});
			$isSynthesizingSpeech = false;

			try {
				const blob = await elevenLabsResponse.blob();
				const audio = new Audio(URL.createObjectURL(blob));
				audio.play();
			} catch (err) {
				console.log('Error playing audio from elevenlabs api, using offline voice instead.');
				$VoiceGenerator = 'offline';
				speakText(text);
			}
		}
	};

	$: {
		if (tiles) {
			const maxSubpage = tiles.reduce((max, tile) => Math.max(max, tile.page || 0), 0);
			let pages = Array.from({ length: maxSubpage + 1 }, (_, pageIndex) =>
				tiles.filter((tile) => (tile.page === undefined ? 0 : tile.page) === pageIndex)
			);

			organizedTiles = removeEmptySubpagesAndUpdateSubpageIndex(pages);

			// add an empty subpage if in edit mode
			if ($isEditing) {
				organizedTiles.push([]);
			}
		}
	}
</script>

<PageHeader />
{#if !$isEditing}<SentenceBuilder {speakText} />{/if}
<div bind:this={node} bind:clientHeight={containerHeight} class="flex-1 bg-zinc-100 overflow-auto">
	{#if containerHeight}
		{#each organizedTiles as pageTiles, pageIndex}
			<TilePage {speakText} {containerHeight} page={pageIndex} tiles={pageTiles} />
		{/each}
	{/if}
</div>
