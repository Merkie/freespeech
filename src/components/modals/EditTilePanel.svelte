<script lang="ts">
	import { Loading, TileBeingEdited, UsingOnlineSearch } from '$ts/client/stores';
	import { getContext } from 'svelte';
	import { uploadFile } from '$ts/client/presigned-uploads';
	import { invalidateAll } from '$app/navigation';
	import type { Tile } from '@prisma/client';

	export let tiles: Tile[];

	let fileinput: HTMLInputElement;
	let showingDisplayTextOption = false;

	const handleMediaUpload = async () => {
		if (!fileinput.files) return;
		const uploadedFile = fileinput.files[0];

		$Loading = true;
		const key = await uploadFile(uploadedFile);
		$Loading = false;

		if (!!key) {
			$TileBeingEdited!.image = `/${key}`;
		}
	};

	async function handleSaveChanges() {
		if (!$TileBeingEdited) return;
		await fetch(`/api/v1/tile/${$TileBeingEdited.id}/edit`, {
			method: 'POST',
			body: JSON.stringify($TileBeingEdited)
		});
		await invalidateAll();
		$TileBeingEdited = null;
	}

	$: changesMade = (() => {
		if (!$TileBeingEdited) return false;
		const originalTile = tiles.find((tile) => tile.id === $TileBeingEdited!.id);
		if (!originalTile) return false;
		return (
			$TileBeingEdited.text !== originalTile.text ||
			$TileBeingEdited.displayText !== originalTile.displayText ||
			$TileBeingEdited.image !== originalTile.image ||
			$TileBeingEdited.color !== originalTile.color
		);
	})();
</script>

{#if $TileBeingEdited}
	<p class="mb-2">Tile Text:</p>
	<input type="text" bind:value={$TileBeingEdited.text} />
	{#if showingDisplayTextOption || $TileBeingEdited.displayText}
		<p class="my-2">Tile Display Text:</p>
		<input type="text" value={$TileBeingEdited.displayText} />
	{:else}
		<button
			on:click={() => (showingDisplayTextOption = true)}
			class="mt-2 text-left text-sm text-zinc-300 hover:underline"
			>Edit display text separately</button
		>
	{/if}
	<p class="my-2 mt-6">Image:</p>
	<div class="flex flex-col gap-2">
		{#if $TileBeingEdited.image}
			<div class="relative rounded-sm border border-zinc-700 p-2">
				<img
					src={`${getContext('media_uri')}${$TileBeingEdited.image}`}
					width={150}
					class="mx-auto rounded-md"
					alt="Uploaded media preview"
				/>
				<button
					on:click={() => {
						if ($TileBeingEdited) $TileBeingEdited.image = '';
					}}
					class="absolute bottom-2 right-4"
				>
					<i class="bi bi-trash-fill" />
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
					on:click={() => {
						$UsingOnlineSearch = true;
					}}
					class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-3 text-sm"
					><i class="bi bi-search" /> Search for Images Online</button
				>
			</div>
		{/if}
	</div>
	<input on:input={handleMediaUpload} type="file" bind:this={fileinput} class="hidden" />

	<p class="my-2 mt-6">Color:</p>
	<div class="flex flex-wrap gap-2 rounded-md">
		{#each ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'] as color}
			{#if color === 'white'}
				<button
					on:click={() => {
						// @ts-ignore
						$TileBeingEdited = { ...$TileBeingEdited, color };
					}}
					class={`${
						$TileBeingEdited.color === color ? 'ring ring-zinc-50' : ''
					} text-md rounded-md border border-zinc-500 bg-zinc-50 p-4 font-medium text-zinc-950 shadow-md`}
				>
					Aa
				</button>
			{:else}
				<button
					on:click={() => {
						// @ts-ignore
						$TileBeingEdited = { ...$TileBeingEdited, color };
					}}
					class={`${
						$TileBeingEdited.color === color ? 'ring ring-zinc-50' : ''
					}  rounded-md shadow-md bg-${color}-100 text-${color}-950 border border-${color}-500 text-md p-4 font-medium`}
				>
					Aa
				</button>
			{/if}
		{/each}
	</div>

	<button
		disabled={!changesMade}
		class="mt-4 flex items-center justify-center gap-2 rounded-md border border-blue-500 bg-blue-600 p-1"
		on:click={handleSaveChanges}
	>
		<i class="bi bi-check-lg" />
		<span>Save Changes</span>
	</button>

	<button
		on:click={() => {
			let tempId = $TileBeingEdited?.id;
			$TileBeingEdited = null;
			const oldTile = tiles.find((tile) => tile.id === tempId);
			if (oldTile) $TileBeingEdited = oldTile;
		}}
		class="mt-4 flex items-center justify-center gap-2 rounded-md border border-zinc-500 bg-zinc-600 p-1"
	>
		<i class="bi bi-x-lg" />
		<span>Cancel Changes</span>
	</button>

	<div class="flex-1"></div>

	<button
		on:click={async () => {
			if (!$TileBeingEdited) return;
			await fetch(`/api/v1/tile/${$TileBeingEdited.id}/delete`, {
				method: 'DELETE'
			});
			await invalidateAll();
			$TileBeingEdited = null;
		}}
		class="mt-4 flex items-center justify-center gap-2 rounded-md border border-red-500 bg-red-600 p-1"
	>
		<i class="bi bi-trash-fill"></i>
		Delete Tile
	</button>
{/if}

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
