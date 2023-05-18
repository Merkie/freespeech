<script lang="ts">
	// stores
	import {
		ActivePage,
		ActiveProject,
		isEditing,
		LocalSettings,
		isSynthesizingSpeech
	} from '$ts/client/stores';
	// components
	import PageHeader from '$components/app/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	// helpers
	import { onMount } from 'svelte';
	import * as htmlToImage from 'html-to-image';
	import ImageResize from 'image-resize';
	// types
	import type { PageData } from './$types';
	import ElevenLabsVoices from '$ts/common/ElevenLabsVoices';
	import type { FullProject, Tile } from '$ts/common/types';

	export let data: PageData;

	/* The data object contains the project and page pulled from
	the page params and database. So we update the stores here for
	the most recent version. */
	$ActiveProject = data.project as FullProject;
	$ActivePage = data.page;

	/* Set the tiles to the tiles of the active page
	this is located within the data property of the page
	it's stored as a JSON blob in the database. */
	let tiles: Tile[] = [];
	$: tiles = (
		$ActiveProject?.pages.find((page) => page.name === $ActivePage)?.data as { tiles: Tile[] }
	).tiles;

	/* This prevents any blank subpages from rendering,
	if any blank subpages are found, the subpage index of all the tiles
	after the blank subpage are updated accordingly (locally only). */
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

	let containerDOMNode: HTMLElement; // Needed for html-to-image
	let containerHeight: number; // Needed for CSS tricks

	// onMount script that handles thumbnail generation
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
		const imageResize = new ImageResize({
			format: 'png',
			width: 500,
			height: 500
		});
		const image = await imageResize.play(await htmlToImage.toPng(containerDOMNode));

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

	// Speaks the given text using the selected voice generator
	// It's this far up in the component tree because it's used
	// in a few different components, and it utilizes stores so it'll
	// be hard to abstract.
	const speakText = async (text: string) => {
		const useOffline = () => {
			const utterance = new SpeechSynthesisUtterance(text);
			if ($LocalSettings.offlineVoice) {
				utterance.voice =
					speechSynthesis.getVoices().find((voice) => voice.name === $LocalSettings.offlineVoice) ||
					null;
			}
			utterance.lang = 'en-US';
			speechSynthesis.speak(utterance);
		};

		if (text.trim() === '') return;

		if ($LocalSettings.voiceGenerator === 'offline') {
			useOffline();
		} else if ($LocalSettings.voiceGenerator === 'elevenlabs') {
			if ($isSynthesizingSpeech) return;
			$isSynthesizingSpeech = true;
			const elevenLabsResponse = await fetch('/api/text-to-speech/elevenlabs/speak', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text,
					name: $LocalSettings.elevenLabsVoice || ElevenLabsVoices[0].name
				})
			});
			$isSynthesizingSpeech = false;

			try {
				const blob = await elevenLabsResponse.blob();
				const audio = new Audio(URL.createObjectURL(blob));
				audio.play();
			} catch (err) {
				console.log('Error playing audio from elevenlabs api, using offline voice instead.');
				useOffline();
			}
		}
	};

	// organizedTiles is the final array of tiles that will be rendered
	let organizedTiles: Tile[][] = [];
	$: {
		if (tiles) {
			// get the largest subpage index found in the tiles
			const maxSubpage = tiles.reduce((max, tile) => Math.max(max, tile.page || 0), 0);

			// group the tiles by subpage index
			let subpages = Array.from({ length: maxSubpage + 1 }, (_, pageIndex) =>
				tiles.filter((tile) => (tile.page === undefined ? 0 : tile.page) === pageIndex)
			);

			// remove empty subpages and update subpage index
			organizedTiles = removeEmptySubpagesAndUpdateSubpageIndex(subpages);

			// add an empty subpage if in edit mode
			if ($isEditing) {
				organizedTiles.push([]);
			}
		}
	}
</script>

<svelte:head>
	<title
		>{$isEditing ? 'Editing: ' : ''}{$ActivePage} - {$ActiveProject?.name} | FreeSpeech AAC</title
	>
</svelte:head>
<PageHeader />
{#if !$isEditing}<SentenceBuilder {speakText} />{/if}
<div
	bind:this={containerDOMNode}
	bind:clientHeight={containerHeight}
	class="flex-1 bg-zinc-100 overflow-auto"
>
	{#if containerHeight}
		{#each organizedTiles as pageTiles, pageIndex}
			<TilePage {speakText} {containerHeight} subpage={pageIndex} tiles={pageTiles} />
		{/each}
	{/if}
</div>
