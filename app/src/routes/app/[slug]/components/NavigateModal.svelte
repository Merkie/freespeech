<script lang="ts">
	// @ts-nocheck
	// Trpc
	import trpc from '$lib/client/trpc';

	import Modal from '$lib/client/components/Modal.svelte';

	// Stores
	import { AppProject, NavigationTile, CurrentPageId, EditedTiles } from '$lib/client/stores';

	let creating_page = false;
	let page_select: HTMLSelectElement;

	let current_page_index;
	let tile_index;

	const create_new_page = async () => {
		if (creating_page) return;
		creating_page = true;
		// Create the page
		const page = await trpc(fetch).mutation('page:create', {
			id: $AppProject.id,
			name: $AppProject.pages[current_page_index].tiles[tile_index].display_text || 'New Page'
		});
		// Set the navigation page id to the new page id
		$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id = page.id;
		// Add the page to the project
		$AppProject.pages = [...$AppProject.pages, page];
		creating_page = false;
		page_select.value = page.name;
		// Update it on the server
		await trpc(fetch).mutation(
			'tile:edit',
			$AppProject.pages[current_page_index].tiles[tile_index]
		);
	};

	const handle_page_change = async (e) => {
		$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id =
			$AppProject.pages.find((page) => page.name === e.target.value)?.id;
		await trpc(fetch).mutation(
			'tile:edit',
			$AppProject.pages[current_page_index].tiles[tile_index]
		);
	};

	$: {
		current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => $NavigationTile?.id === t.id
		);
	}
</script>

{#if $NavigationTile}
	<Modal close_modal={() => ($NavigationTile = null)} title="Navigation">
		<span>
			<select
				bind:this={page_select}
				disabled={creating_page}
				on:change={handle_page_change}
				value={$AppProject.pages.find((page) => page.id === $NavigationTile?.navigation_page_id)
					?.name || 'none'}
			>
				<option value="none">No Navigation</option>
				{#each $AppProject.pages as page}
					{#if page.name.toLowerCase() !== $AppProject.pages[current_page_index].name.toLowerCase()}
						<option value={page.name}>{page.name}</option>
					{/if}
				{/each}
			</select>
			<button on:click={create_new_page}>Create new page</button>
		</span>
	</Modal>
{/if}

<style>
	span {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}

	button {
		background-color: var(--success-300);
		border: 1px solid var(--success-400);
	}

	select:disabled {
		opacity: 0.5;
	}
</style>
