<script lang="ts">
	import { Loading } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';

	export let image: string;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigateBack: () => void;

	let searchingOnlineImages = true;
	let onlineSearchTerm = '';
	let imageSearchResults: { thumbnail: string; image: string; alt: string }[] = [];
	let searching = false;

	const imageResize = new ImageResize({
		format: 'png',
		width: 800,
		height: 800
	});

	const handleUploadFromInternet = async (url: string) => {
		// convert url into base64
		const response = await fetch(url);
		const blob = await response.blob();
		const base64data = await imageResize.play(blob);

		$Loading = true;
		const uploadImageResponse = await fetch('/api/v1/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: url.split('/').pop(),
				base64data: (base64data + '').split(',')[1]
			})
		});
		$Loading = false;

		const data = await uploadImageResponse.json();

		if (data.fileurl) {
			image = data.fileurl;
			handleImageChange(data.fileurl);
			searchingOnlineImages = false;
		}
	};

	const searchImages = async () => {
		searching = true;
		const response = await fetch(
			`/api/v1/media/search-google-images/${encodeURIComponent(onlineSearchTerm)}`
		);
		searching = false;
		const data = await response.json();
		if (data.length > 1) imageSearchResults = data;
	};
</script>

<ModalShell title="Edit Tile">
	<button on:click={handleNavigateBack} class="mb-2 flex items-center gap-1 text-sm text-zinc-300">
		<i class="bi bi-arrow-left" />
		Back
	</button>
	<div class="mb-2 flex items-center gap-2">
		<div
			class="flex flex-1 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 text-zinc-800"
		>
			<i class="bi bi-search" />
			<input
				type="text"
				bind:value={onlineSearchTerm}
				on:keydown={(e) => {
					if (e.key === 'Enter') searchImages();
				}}
				placeholder="Search for images..."
				class="flex-1 border-none outline-none"
			/>
		</div>
		<button on:click={searchImages} class="rounded-md border border-blue-500 bg-blue-600 p-1 px-2"
			>{searching ? 'Searching...' : 'Search'}</button
		>
	</div>
	<div class="flex max-h-[500px] min-h-[300px] gap-2 overflow-y-auto">
		<div class="flex-1">
			{#each imageSearchResults.filter((_, i) => i % 2 === 0) as image}
				<button disabled={searching} on:click={() => handleUploadFromInternet(image.thumbnail)}>
					<img class="w-full" src={image.thumbnail} alt="search result" />
				</button>
			{/each}
		</div>
		<div class="flex-1">
			{#each imageSearchResults.filter((_, i) => i % 2 !== 0) as image}
				<button disabled={searching} on:click={() => handleUploadFromInternet(image.thumbnail)}>
					<img class="w-full" src={image.thumbnail} alt="search result" />
				</button>
			{/each}
		</div>
	</div>
</ModalShell>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
