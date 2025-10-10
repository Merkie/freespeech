<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Loading, LocalSettings, TileBeingEdited, UsingOnlineSearch } from '$ts/client/stores';
	import { scale } from 'svelte/transition';
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

	let onlineSearchTerm = $state($TileBeingEdited?.text || '');
	let imageSearchResults: SearchResult[] = $state([]);
	let searching = $state(false);

	let selectedSearchStrategy: 'bing' | 'open-symbols' = $state('bing');
	let selectedSkinTone = $derived(($LocalSettings.skinTone || 'medium') as SkinTone);

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
		if (selectedSearchStrategy === 'bing') {
			const { results: images } = await api.media.searchImages.bing({
				query: onlineSearchTerm,
				skinColor: selectedSkinTone
			});
			if (images) imageSearchResults = [...images];
		} else {
			const { results: images } = await api.media.searchImages.openSymbols({
				query: onlineSearchTerm,
				skinColor: selectedSkinTone
			});
			if (images) imageSearchResults = [...images];
		}
		searching = false;
	};

	const handleSkinToneRefresh = () => {
		if (selectedSearchStrategy !== 'open-symbols') return;
		if (imageSearchResults.length === 0) return;
		searchImages();
	};

	run(() => {
		$LocalSettings.skinTone;
		handleSkinToneRefresh();
	});
</script>

<button
	onclick={() => {
		$UsingOnlineSearch = false;
	}}
	class="mb-2 flex items-center gap-1 text-sm text-zinc-300"
>
	<i class="bi bi-arrow-left"></i>
	Back
</button>

<div class="flex gap-4 py-4">
	<button
		onclick={() => (selectedSearchStrategy = 'bing')}
		class={selectedSearchStrategy === 'bing' ? 'underline' : ''}
	>
		<i class="bi bi-bing mr-1"></i>
		<span>Bing Images</span>
	</button>
	<button
		onclick={() => (selectedSearchStrategy = 'open-symbols')}
		class={selectedSearchStrategy === 'open-symbols' ? 'underline' : ''}>Open Symbols</button
	>
</div>

{#if selectedSearchStrategy === 'open-symbols'}
	<div class="item-center flex items-center gap-1 pb-4">
		<p class="pr-3">Skin tone:</p>
		{#each SkinTones as skinTone}
			<button
				aria-label={`Select ${skinTone.name} skin tone`}
				onclick={() => ($LocalSettings.skinTone = skinTone.name)}
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
		<i class="bi bi-search"></i>
		<input
			type="text"
			bind:value={onlineSearchTerm}
			onkeydown={(e) => {
				if (e.key === 'Enter') searchImages();
			}}
			placeholder={`Search for ${
				selectedSearchStrategy === 'bing' ? 'images with Bing' : 'symbols on Open Symbols'
			}...`}
			class="w-full border-none outline-none"
		/>
	</div>
	<button
		onclick={searchImages}
		class="rounded-md border border-blue-500 bg-blue-600 p-1 px-4 text-sm"
		>{searching ? 'Searching...' : 'Search'}</button
	>
</div>

{#if imageSearchResults.length === 0 && !searching}
	<p class="mt-8 text-center text-zinc-300">No results found</p>
{/if}

<div class="mt-2 flex-1 overflow-y-auto">
	<div class="rows-1 columns-2 gap-4">
		<!-- {#key imageSearchResults} -->
		{#each imageSearchResults as image (image.image_url)}
			<button
				in:scale
				disabled={searching}
				onclick={() => handleUploadFromInternet(image.image_url)}
				class="mb-4 w-full"
			>
				<img class="mx-auto" src={image.thumbnail_url} alt={image.alt} />
			</button>
		{/each}
		<!-- {/key} -->
	</div>
</div>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
