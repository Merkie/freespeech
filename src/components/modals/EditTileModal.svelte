<script lang="ts">
	import { ActivePage, ActiveProject, openModal } from '$ts/client/stores';
	import { getContext } from 'svelte';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';
	export let text: string;
	export let displayText: string;
	export let image: string;
	export let navigation: string;
	export let color: string;
	export let handleTextChange: (newText: string) => void;
	export let handleDisplayTextChange: (newDisplayText: string) => void;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigationChange: (newNavigation: string) => void;
	export let handleColorChange: (newColor: string) => void;
	export let handleOnlineImageSearch: () => void;
	export let deleteTile: (key: string) => void;

	let fileinput: HTMLInputElement;
	let showingDisplayTextOption = false;

	const imageResize = new ImageResize({
		format: 'png',
		width: 800,
		height: 800
	});

	const handleMediaUpload = async () => {
		if (!fileinput.files) return;
		const uploadedFile = fileinput.files[0];

		const base64data = await imageResize.play(uploadedFile);

		const response = await fetch('/api/v1/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: `${uploadedFile.name}.png`,
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

<ModalShell title="Edit Tile">
	<p class="mb-2">Tile Text:</p>
	<input
		on:input={(e) => {
			//@ts-ignore
			handleTextChange(e.target.value);
		}}
		type="text"
		value={text}
	/>
	{#if showingDisplayTextOption || displayText}
		<p class="my-2">Tile Display Text:</p>
		<input
			on:input={(e) => {
				//@ts-ignore
				handleDisplayTextChange(e.target.value);
			}}
			type="text"
			value={displayText}
		/>
	{:else}
		<button
			on:click={() => (showingDisplayTextOption = true)}
			class="mt-2 text-left text-sm text-zinc-300 hover:underline"
			>Edit display text separately</button
		>
	{/if}
	<p class="my-2">Image:</p>
	<div class="flex flex-col gap-2">
		{#if image}
			<img src={`${getContext('media_uri')}${image}`} width={150} alt="Uploaded media preview" />
			<div class="flex items-center gap-2">
				<!-- <button
					on:click={() => ($openModal = { name: 'crop-image', key: $openModal.key })}
					class="w-fit rounded-md border border-zinc-500 bg-zinc-600 p-1 px-3 text-sm"
				>
					<i class="bi bi-crop" /> Crop Tile Image
				</button> -->
				<button
					on:click={() => {
						image = '';
						handleImageChange('');
					}}
					class="w-fit rounded-md border border-red-500 bg-red-600 p-1 px-3 text-sm"
				>
					<i class="bi bi-trash mr-1" /> Remove Tile Image
				</button>
			</div>
		{:else}
			<div class="flex flex-wrap gap-2">
				<button
					on:click={() => fileinput.click()}
					class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-3 text-sm"
					><i class="bi bi-upload mr-1" /> Upload Image From Device</button
				>
				<button
					on:click={handleOnlineImageSearch}
					class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-3 text-sm"
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
	<div class="flex flex-wrap gap-2 rounded-md">
		{#each ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'] as _color}
			{#if _color === 'white'}
				<button
					on:click={() => {
						handleColorChange(_color);
					}}
					class={`${
						color === 'white' ? 'ring ring-zinc-50' : ''
					} text-md rounded-md border border-zinc-500 bg-zinc-50 p-4 font-medium text-zinc-950 shadow-md`}
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
					}  rounded-md shadow-md bg-${_color}-100 text-${_color}-950 border border-${_color}-500 text-md p-4 font-medium`}
				>
					Aa
				</button>
			{/if}
		{/each}
	</div>
	<button
		on:click={() => {
			deleteTile($openModal.key + '');
			$openModal = { name: '' };
		}}
		class="mt-4 rounded-md border border-red-500 bg-red-600 p-1"
	>
		Delete Tile
	</button>
</ModalShell>

<style lang="postcss">
	input,
	select {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
