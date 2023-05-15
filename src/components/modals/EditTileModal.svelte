<script lang="ts">
	import { ActivePage, ActiveProject } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';
	export let text: string;
	export let image: string;
	export let navigation: string;
	export let color: string;
	export let closeModal: () => void;
	export let handleTextChange: (newText: string) => void;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigationChange: (newNavigation: string) => void;
	export let handleColorChange: (newColor: string) => void;
	export let deleteTile: () => void;

	let fileinput: HTMLInputElement;
	let searchingOnlineImages = false;
	let onlineSearchTerm = '';
	let imageSearchResults: { thumbnail: string; image: string; alt: string }[] = [];
	let searching = false;

	const imageResize = new ImageResize({
		format: 'png',
		width: 500,
		height: 500
	});

	const handleMediaUpload = async () => {
		if (!fileinput.files) return;
		const uploadedFile = fileinput.files[0];

		const base64data = await imageResize.play(uploadedFile);

		const response = await fetch('/api/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: uploadedFile.name,
				base64data: (base64data + '').split(',')[1]
			})
		});

		const data = await response.json();

		if (data.fileurl) {
			image = data.fileurl;
			handleImageChange(data.fileurl);
		}
	};

	const handleUploadFromInternet = async (url: string) => {
		// convert url into base64
		const response = await fetch(url);
		const blob = await response.blob();
		const base64data = await imageResize.play(blob);

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
	{#if !searchingOnlineImages}
		<p class="mb-2">Tile Text:</p>
		<input
			on:input={(e) => {
				//@ts-ignore
				handleTextChange(e.target.value);
			}}
			type="text"
			value={text}
		/>
		<p class="my-2">Image:</p>
		<div class="flex flex-col gap-2">
			<div class="flex flex-wrap gap-2">
				<button
					on:click={() => fileinput.click()}
					class="bg-zinc-800 px-3 p-1 text-sm rounded-md border border-zinc-700"
					><i class="bi bi-upload mr-1" /> Upload Image From Device</button
				>
				<button
					on:click={() => (searchingOnlineImages = true)}
					class="bg-zinc-800 px-3 p-1 text-sm rounded-md border border-zinc-700"
					><i class="bi bi-search" /> Search for Images Online</button
				>
			</div>
			{#if image}
				<div class="flex flex-col gap-1">
					<img src={image} width={100} alt="Uploaded media preview" />
				</div>
			{/if}
		</div>
		<input on:input={handleMediaUpload} type="file" bind:this={fileinput} class="hidden" />
		<p class="my-2">Navigation:</p>
		<select
			on:input={(e) => {
				//@ts-ignore
				handleNavigationChange(e.target.value);
			}}
			value={navigation}
		>
			<option value={''}>None</option>
			{#each $ActiveProject?.pages.filter((page) => page.name !== $ActivePage) || [] as page}
				<option value={page.name}>{page.name}</option>
			{/each}
		</select>

		<p class="my-2">Color:</p>
		<div class="gap-2 flex flex-wrap rounded-md">
			{#each ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'] as _color}
				{#if _color === 'white'}
					<button
						on:click={() => {
							handleColorChange(_color);
						}}
						class={`${
							color === 'white' ? 'ring ring-zinc-50' : ''
						} shadow-md rounded-md bg-zinc-50 text-zinc-950 border border-zinc-500 p-4 text-md font-medium`}
					>
						Aa
					</button>
				{:else}
					<button
						on:click={() => {
							handleColorChange(_color);
						}}
						class={`${
							color === _color ? 'ring ring-zinc-50' : ''
						}  shadow-md rounded-md bg-${_color}-100 text-${_color}-950 border border-${_color}-500 p-4 text-md font-medium`}
					>
						Aa
					</button>
				{/if}
			{/each}
		</div>
		<button
			on:click={() => {
				deleteTile();
				closeModal();
			}}
			class="bg-red-600 p-1 rounded-md border border-red-500 mt-4"
			on:click={deleteTile}
		>
			Delete Tile
		</button>
	{:else}
		<button
			on:click={() => (searchingOnlineImages = false)}
			class="flex items-center gap-1 mb-2 text-sm text-zinc-300"
		>
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
	{/if}
</ModalShell>

<style lang="postcss">
	input,
	select {
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
