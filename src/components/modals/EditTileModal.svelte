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
	export let handleOnlineImageSearch: () => void;
	export let deleteTile: () => void;

	let fileinput: HTMLInputElement;

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
</script>

<ModalShell {closeModal} title="Edit Tile">
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
		{#if image}
			<img src={image} width={150} alt="Uploaded media preview" />
			<button
				on:click={() => {
					image = '';
					handleImageChange('');
				}}
				class="bg-red-600 w-fit px-3 p-1 text-sm rounded-md border border-red-500"
			>
				<i class="bi bi-trash mr-1" /> Remove Tile Image
			</button>
		{:else}
			<div class="flex flex-wrap gap-2">
				<button
					on:click={() => fileinput.click()}
					class="bg-zinc-800 px-3 p-1 text-sm rounded-md border border-zinc-700"
					><i class="bi bi-upload mr-1" /> Upload Image From Device</button
				>
				<button
					on:click={handleOnlineImageSearch}
					class="bg-zinc-800 px-3 p-1 text-sm rounded-md border border-zinc-700"
					><i class="bi bi-search" /> Search for Images Online</button
				>
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
</ModalShell>

<style lang="postcss">
	input,
	select {
		@apply px-2 p-1 rounded-md border border-zinc-300 text-zinc-800;
	}
</style>
