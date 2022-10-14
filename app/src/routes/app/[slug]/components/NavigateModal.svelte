<script lang="ts">
	// @ts-nocheck
	// Trpc
	import trpc from '$lib/client/trpc';

	// Stores
	import { AppProject, NavigationTile, CurrentPageId } from '$lib/client/stores';

	// Click outside
	import { clickOutside } from '$lib/client/clickOutside';

	let select_value;
	let creating_page = false;

	let current_page_index;
	let tile_index;

	const create_new_page = async () => {
		if (creating_page) return;
		creating_page = true;
		// Create the page
		const page = await trpc(fetch).mutation('page:create', {
			id: $AppProject.id,
			name: $NavigationTile?.display_text || 'New page'
		});
		// Set the navigation page id to the new page id
		$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id = page.id;
		// Add the page to the project
		$AppProject.pages = [...$AppProject.pages, page];
		// Update it on the server
		await trpc(fetch).mutation(
			'tile:edit',
			$AppProject.pages[current_page_index].tiles[tile_index]
		);
	};

	const close_modal = () => {
		if (creating_page) {
			creating_page = false;
			$NavigationTile = null;
			select_value = 'none';
			return;
		}
		if (select_value === 'none' && $NavigationTile.navigation_page_id) {
			$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id = null;
			// Get the updated tile
			const updated_tile = $AppProject.pages[current_page_index].tiles[tile_index];
			// Update it on the server
			trpc(fetch).mutation('tile:edit', updated_tile);
		} else if (select_value != $NavigationTile.navigation_page_id) {
			$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id =
				$AppProject.pages.find((page) => page.name === select_value)?.id;
			// Get the updated tile
			const updated_tile = $AppProject.pages[current_page_index].tiles[tile_index];
			// Update it on the server
			trpc(fetch).mutation('tile:edit', updated_tile);
		}
		$NavigationTile = null;
		select_value = 'none';
	};

	$: {
		current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => $NavigationTile?.id === t.id
		);
	}
</script>

{#if $NavigationTile}
	<main use:clickOutside on:click_outside={close_modal}>
		<h3>Navigation</h3>
		<select disabled={creating_page} bind:value={select_value}>
			<option value="none">No Navigation</option>
			{#each $AppProject.pages as page}
				{#if page.name.toLowerCase() !== $AppProject.pages[current_page_index].name.toLowerCase()}
					<option value={page.name}>{page.name}</option>
				{/if}
			{/each}
		</select>
		<button on:click={create_new_page}>Create new page</button>
	</main>
{/if}

<style>
	main {
		position: fixed;
		display: flex;
		flex-direction: column;
		padding: 20px;
		min-width: 300px;
		background-color: var(--base-100);
		border: 1px solid var(--base-400);
		border-radius: 10px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 0 100000px rgba(0, 0, 0, 0.8);
		gap: 20px;
	}

	button {
		background-color: var(--success-300);
		border: 1px solid var(--success-400);
	}

	select:disabled {
		opacity: 0.5;
	}
</style>
