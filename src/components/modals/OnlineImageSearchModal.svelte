<script lang="ts">
	import { Loading } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';

	export let image: string;
	export let closeModal: () => void;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigateBack: () => void;

	let searchingOnlineImages = true;
	let onlineSearchTerm = '';
	let imageSearchResults: { thumbnail: string; image: string; alt: string }[] = [];
	let searching = false;

	const imageResize = new ImageResize({
		format: 'png',
		width: 500,
		height: 500
	});

	const handleUploadFromInternet = async (url: string) => {
		// convert url into base64
		const response = await fetch(url);
		const blob = await response.blob();
		const base64data = await imageResize.play(blob);

		$Loading = true;
		const uploadImageResponse = await fetch('/api/media/upload', {
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
			`/api/media/search/duckduckgo/${encodeURIComponent(onlineSearchTerm)}`
		);
		searching = false;
		const data = await response.json();
		if (data.length > 1) imageSearchResults = data;
	};
</script>

<ModalShell {closeModal} title="Edit Tile">
	<button on:click={handleNavigateBack} class="flex items-center gap-1 mb-2 text-sm text-zinc-300">
		<i class="bi bi-arrow-left" />
		Back
	</button>
	<div class="flex items-center gap-2 mb-2">
		<div
			class="px-2 rounded-md bg-white border border-zinc-300 text-zinc-800 flex items-center gap-1 flex-1"
		>
			<i class="bi bi-search" />
			<input
				type="text"
				bind:value={onlineSearchTerm}
				placeholder="Search for images..."
				class="outline-none flex-1 border-none"
			/>
		</div>
		<button on:click={searchImages} class="p-1 px-2 bg-blue-600 border border-blue-500 rounded-md"
			>{searching ? 'Searching...' : 'Search'}</button
		>
	</div>
	<div class="masonry-layout min-h-[300px] max-h-[500px] overflow-y-auto">
		{#each imageSearchResults as image}
			<button disabled={searching} on:click={() => handleUploadFromInternet(image.thumbnail)}>
				<img width={200} class="object-contain" src={image.thumbnail} alt="search result" />
			</button>
		{/each}
	</div>
</ModalShell>

<style lang="postcss">
	input {
		@apply px-2 p-1 rounded-md border border-zinc-300 text-zinc-800;
	}

	.masonry-layout {
		/* Create a column layout with a gap between items */
		display: grid;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-auto-rows: min-content;
	}
	@media screen and (max-width: 600px) {
		.masonry-layout {
			/* For small screens, reduce the number of columns */
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}
	}
</style>
