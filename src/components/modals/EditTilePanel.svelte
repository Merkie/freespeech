<script lang="ts">
	import { run } from 'svelte/legacy';

	import { Loading, TileBeingEdited, UnsavedChanges, UsingOnlineSearch } from '$ts/client/stores';
	import { uploadFile } from '$ts/client/presigned-uploads';
	import { invalidateAll } from '$app/navigation';
	import type { Tile, TilePage } from '$ts/common/types';
	import api from '$ts/client/api';

	interface Props {
		tiles: Tile[];
		pages: TilePage[];
		projectId: string;
		isHomePage: boolean;
	}

	let { tiles, pages, projectId, isHomePage }: Props = $props();

	let fileinput: HTMLInputElement = $state()!;
	let showingDisplayTextOption = $state(false);

	const tileColors = {
		white: {
			background_color: '#fafafa',
			border_color: '#71717a'
		},
		purple: {
			background_color: '#f3e8ff',
			border_color: '#a855f7'
		},
		yellow: {
			background_color: '#fef9c3',
			border_color: '#eab308'
		},
		pink: {
			background_color: '#fce7f3',
			border_color: '#ec4899'
		},
		green: {
			background_color: '#dcfce7',
			border_color: '#22c55e'
		},
		blue: {
			background_color: '#dbeafe',
			border_color: '#3b82f6'
		},
		orange: {
			background_color: '#ffedd5',
			border_color: '#f97316'
		},
		red: {
			background_color: '#fee2e2',
			border_color: '#ef4444'
		}
	};

	const handleMediaUpload = async () => {
		if (!fileinput.files || !$TileBeingEdited) return;
		const uploadedFile = fileinput.files[0];

		$Loading = true;
		const key = await uploadFile(uploadedFile);
		$Loading = false;

		if (!!key) {
			$TileBeingEdited.image = `https://media.freespeechaac.com/${key}`;
		}
	};

	async function handleSaveChanges() {
		if (!$TileBeingEdited) return;
		await api.tile.edit($TileBeingEdited.id, $TileBeingEdited);
		if (isHomePage) void api.project.updateThumbnail(projectId);
		await invalidateAll();
	}

	const getColorFromKey = (color: string) => {
		return tileColors[color as keyof typeof tileColors];
	};

	run(() => {
		$UnsavedChanges = (() => {
			if (!$TileBeingEdited) return false;
			const originalTile = tiles.find((tile) => tile.id === $TileBeingEdited!.id);
			if (!originalTile) return false;
			return (
				$TileBeingEdited.text !== originalTile.text ||
				$TileBeingEdited.displayText !== originalTile.displayText ||
				$TileBeingEdited.image !== originalTile.image ||
				$TileBeingEdited.backgroundColor !== originalTile.backgroundColor ||
				$TileBeingEdited.borderColor !== originalTile.borderColor ||
				$TileBeingEdited.navigation !== originalTile.navigation
			);
		})();
	});
</script>

{#if $TileBeingEdited}
	<p class="mb-2">Tile Text:</p>
	<input type="text" bind:value={$TileBeingEdited.text} />
	{#if showingDisplayTextOption || $TileBeingEdited.displayText}
		<p class="my-2">Tile Display Text:</p>
		<input type="text" value={$TileBeingEdited.displayText} />
	{:else}
		<button
			onclick={() => (showingDisplayTextOption = true)}
			class="mt-2 text-left text-sm text-zinc-300 hover:underline"
			>Edit display text separately</button
		>
	{/if}
	<p class="my-2 mt-6">Image:</p>
	<div class="flex flex-col gap-2">
		{#if $TileBeingEdited.image}
			<div
				style="background-image: url('https://img.freepik.com/premium-vector/checkered-background-transparent-texture-vector-grid-pattern-gray-white-backdrop_231786-5657.jpg');"
				class="relative rounded-sm border border-zinc-700 p-2"
			>
				<img
					src={$TileBeingEdited.image}
					width={150}
					class="mx-auto rounded-md"
					alt="Uploaded media preview"
				/>
				<button
					aria-label="Remove image"
					onclick={() => {
						if ($TileBeingEdited) $TileBeingEdited.image = '';
					}}
					class="absolute bottom-2 right-4 grid h-[30px] w-[30px] place-items-center rounded-md bg-red-500 text-white"
				>
					<i class="bi bi-trash-fill"></i>
				</button>
			</div>
		{:else}
			<div class="flex flex-wrap gap-2">
				<button
					onclick={() => fileinput.click()}
					class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-3 text-sm"
					><i class="bi bi-upload mr-1"></i> Upload Image From Device</button
				>
				<button
					onclick={() => {
						$UsingOnlineSearch = true;
					}}
					class="rounded-md border border-zinc-700 bg-zinc-800 p-1 px-3 text-sm"
					><i class="bi bi-search"></i> Search for Images Online</button
				>
			</div>
		{/if}
	</div>
	<input oninput={handleMediaUpload} type="file" bind:this={fileinput} class="hidden" />

	<p class="my-2 mt-6">Color:</p>
	<div class="flex flex-wrap gap-2 rounded-md text-black">
		{#each Object.keys(tileColors) as colorKey}
			{@const colorValues = getColorFromKey(colorKey)}
			<button
				onclick={() => {
					// @ts-ignore
					$TileBeingEdited = {
						...$TileBeingEdited,
						backgroundColor: colorValues.background_color,
						borderColor: colorValues.border_color
					};
				}}
				class={`${
					$TileBeingEdited.backgroundColor === colorValues.background_color &&
					$TileBeingEdited.borderColor === colorValues.border_color
						? 'ring-2 ring-zinc-50'
						: ''
				} text-md rounded-md border p-4 font-medium shadow-md`}
				style={`background-color: ${colorValues.background_color}; border-color: ${colorValues.border_color};`}
			>
				Aa
			</button>
		{/each}
	</div>

	<p class="my-2 mt-6">Navigation:</p>
	<div>
		<select
			class="rounded-md border border-zinc-300 p-1 px-2 text-zinc-800"
			bind:value={$TileBeingEdited.navigation}
		>
			<option value={''}>No Navigation</option>
			{#each pages as page (page.id)}
				<option value={page.id}>{page.name}</option>
			{/each}
		</select>
	</div>

	<button
		disabled={!$UnsavedChanges}
		class="mt-4 flex items-center justify-center gap-2 rounded-md border border-blue-500 bg-blue-600 p-1"
		onclick={handleSaveChanges}
	>
		<i class="bi bi-check-lg"></i>
		<span>Save Changes</span>
	</button>

	<button
		onclick={() => {
			let tempId = $TileBeingEdited?.id;
			$TileBeingEdited = null;
			const oldTile = tiles.find((tile) => tile.id === tempId);
			if (oldTile) $TileBeingEdited = oldTile;
		}}
		class="mt-4 flex items-center justify-center gap-2 rounded-md border border-zinc-500 bg-zinc-600 p-1"
		disabled={!$UnsavedChanges}
	>
		<i class="bi bi-x-lg"></i>
		<span>Cancel Changes</span>
	</button>

	<div class="flex-1"></div>

	<div class="my-8 flex flex-col">
		<div class="h-[1px] bg-zinc-800"></div>
		<div class="h-[1px] bg-zinc-950"></div>
	</div>

	<button
		onclick={async () => {
			if (!$TileBeingEdited) return;
			await api.tile.delete($TileBeingEdited.id);
			if (isHomePage) void api.project.updateThumbnail(projectId);
			await invalidateAll();
			$TileBeingEdited = null;
		}}
		class="flex items-center justify-center gap-2 rounded-md border border-red-500 bg-red-600 p-1"
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
