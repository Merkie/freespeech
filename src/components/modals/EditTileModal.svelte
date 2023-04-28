<script lang="ts">
	import { ActivePage, ActiveProject } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';
	export let text: string;
	export let image: string;
	export let navigation: string;
	export let closeModal: () => void;
	export let handleTextChange: (newText: string) => void;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigationChange: (newNavigation: string) => void;
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
	<p>Tile Text:</p>
	<input
		on:input={(e) => {
			//@ts-ignore
			handleTextChange(e.target.value);
		}}
		type="text"
		value={text}
	/>
	<p class="mt-2">Image:</p>
	<div class="flex items-center gap-2">
		{#if image}
			<img src={image} width={100} alt="Uploaded media preview" />
		{/if}
		<button
			on:click={() => fileinput.click()}
			class="bg-zinc-800 px-4 p-2 rounded-md border border-zinc-700">Upload Image</button
		>
	</div>
	<input on:input={handleMediaUpload} type="file" bind:this={fileinput} class="hidden" />
	<p class="mt-2">Navigation:</p>
	<select
		on:input={(e) => {
			//@ts-ignore
			handleNavigationChange(e.target.value);
		}}
		value={navigation}
	>
		<option value="">None</option>
		{#each $ActiveProject?.pages || [] as page}
			<option value={page.name}>{page.name}</option>
		{/each}
	</select>
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
