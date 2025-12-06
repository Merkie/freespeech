<script lang="ts">
	import { Loading, LocalSettings, TileBeingEdited, UsingOnlineSearch } from '$ts/client/stores';
	import { fade } from 'svelte/transition';
	// @ts-ignore
	import { SkinTones } from '$ts/common/opensymbols';
	import { uploadBlob } from '$ts/client/presigned-uploads';
	import type { SkinTone } from '$ts/common/types';
	import api from '$ts/client/api';

	type SearchResult = {
		image_url: string;
		thumbnail_url: string;
		alt: string;
	};

	let onlineSearchTerm = $TileBeingEdited?.text || '';
	let imageSearchResults: SearchResult[] = [];
	let searching = false;
	let imagesReady = false;

	let selectedSearchStrategy: 'google' | 'open-symbols' = 'google';
	$: selectedSkinTone = ($LocalSettings.skinTone || 'medium') as SkinTone;

	const preloadImages = (images: SearchResult[]): Promise<void> => {
		if (images.length === 0) return Promise.resolve();

		return new Promise((resolve) => {
			let loadedCount = 0;
			const totalImages = images.length;

			images.forEach((image) => {
				const img = new Image();
				img.onload = img.onerror = () => {
					loadedCount++;
					if (loadedCount >= totalImages) {
						resolve();
					}
				};
				img.src = image.thumbnail_url;
			});
		});
	};

	const handleUploadFromInternet = async (url: string) => {
		if (!$TileBeingEdited) return;

		const filename = url.split('/').pop() + '';

		const blob = await api.media.fetchFromUrl(url);

		$Loading = true;
		const key = await uploadBlob(filename, blob);
		$Loading = false;

		// Upload the image to the presigned URL
		if (!!key) {
			$UsingOnlineSearch = false;
			$TileBeingEdited.image = `https://media.freespeechaac.com/${key}`;
		}
	};

	const searchImages = async () => {
		searching = true;
		imagesReady = false;
		imageSearchResults = [];

		let images: SearchResult[] = [];
		if (selectedSearchStrategy === 'google') {
			const response = await api.media.searchImages.google({
				query: onlineSearchTerm,
				skinColor: selectedSkinTone
			});
			if (response.results) images = response.results;
		} else {
			const response = await api.media.searchImages.openSymbols({
				query: onlineSearchTerm,
				skinColor: selectedSkinTone
			});
			if (response.results) images = response.results;
		}

		if (images.length > 0) {
			await preloadImages(images);
			imageSearchResults = images;
		}

		imagesReady = true;
		searching = false;
	};

	const handleSkinToneRefresh = () => {
		if (selectedSearchStrategy !== 'open-symbols') return;
		if (imageSearchResults.length === 0) return;
		searchImages();
	};

	$: {
		$LocalSettings.skinTone;
		handleSkinToneRefresh();
	}
</script>

<button
	on:click={() => {
		$UsingOnlineSearch = false;
	}}
	class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
>
	<i class="bi bi-arrow-left" />
	Back
</button>

<div class="flex gap-4 py-4">
	<button
		on:click={() => {
			selectedSearchStrategy = 'google';
			imageSearchResults = [];
			imagesReady = false;
		}}
		class={selectedSearchStrategy === 'google' ? 'underline' : ''}
	>
		<i class="bi bi-google mr-1"></i>
		<span>Google Images</span>
	</button>
	<button
		on:click={() => {
			selectedSearchStrategy = 'open-symbols';
			imageSearchResults = [];
			imagesReady = false;
		}}
		class={selectedSearchStrategy === 'open-symbols' ? 'underline' : ''}>Open Symbols</button
	>
</div>

{#if selectedSearchStrategy === 'open-symbols'}
	<div class="item-center flex items-center gap-1 pb-4">
		<p class="pr-3">Skin tone:</p>
		{#each SkinTones as skinTone}
			<button
				on:click={() => ($LocalSettings.skinTone = skinTone.name)}
				class={`h-[40px] flex-1 rounded-sm ${
					selectedSkinTone === skinTone.name
						? 'scale-90 ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
						: ''
				}`}
				style={`background-color: ${skinTone.pigmentHexValue}`}
			>
			</button>
		{/each}
	</div>
{/if}

<div class="mb-2 flex items-center gap-2">
	<div
		class="flex flex-1 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-800"
	>
		<i class="bi bi-search" />
		<input
			type="text"
			bind:value={onlineSearchTerm}
			on:keydown={(e) => {
				if (e.key === 'Enter' && !searching) searchImages();
			}}
			placeholder={`Search for ${
				selectedSearchStrategy === 'google' ? 'images online' : 'symbols on Open Symbols'
			}...`}
			class="w-full border-none outline-none"
		/>
	</div>
	<button
		on:click={searchImages}
		disabled={searching}
		class="rounded-md border border-blue-500 bg-blue-600 p-1 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
		>{searching ? 'Searching...' : 'Search'}</button
	>
</div>

{#if searching}
	<div class="mt-8 flex flex-col items-center justify-center gap-3">
		<div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-blue-500"></div>
		<p class="text-center text-zinc-300">Searching for images...</p>
		<p class="text-center text-xs text-zinc-500">This may take a few seconds</p>
	</div>
{:else if imagesReady && imageSearchResults.length === 0}
	<p class="mt-8 text-center text-zinc-300">No results found</p>
{/if}

{#if imagesReady && imageSearchResults.length > 0}
	<div class="mt-2 flex-1 overflow-y-auto" in:fade={{ duration: 200 }}>
		<div class="rows-1 columns-2 gap-4">
			{#each imageSearchResults as image (image.image_url)}
				<button
					disabled={searching}
					on:click={() => handleUploadFromInternet(image.image_url)}
					class="mb-4 w-full"
				>
					<img class="mx-auto" src={image.thumbnail_url} alt={image.alt} />
				</button>
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
