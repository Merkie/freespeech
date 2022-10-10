<script lang="ts">
	// @ts-nocheck
	// Trpc
	import trpc from '$lib/client/trpc';

	// Stores
	import { AppProject, NavigationTile, CurrentPageId } from '$lib/client/stores';

	// Click outside
	import { clickOutside } from '$lib/client/clickOutside';

	const create_new_page = async () => {
		// Get the current page index
		const current_page_index = $AppProject.pages.findIndex((page) => page.id === $CurrentPageId);
		// Get the current tile index
		const tile_index = $AppProject.pages[current_page_index].tiles.findIndex(
			(t) => $NavigationTile?.id === t.id
		);
		// Create the page
		const page = await trpc(fetch).mutation('page:create', $AppProject.id);
		// Set the navigation page id to the new page id
		$AppProject.pages[current_page_index].tiles[tile_index].navigation_page_id = page.id;
		// Add the page to the project
		$AppProject.pages = [...$AppProject.pages, page];
		// Get the updated tile
		const updated_tile = $AppProject.pages[current_page_index].tiles[tile_index];
		// Update it on the server
		await trpc(fetch).mutation('tile:edit', updated_tile);
	};
</script>

{#if $NavigationTile}
	<main use:clickOutside on:click_outside={() => ($NavigationTile = null)}>
		<h3>Navigation</h3>
		<select name="" id="">
			{#each $AppProject.pages as page}
				<option value={page.name}>{page.name}</option>
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
		box-shadow: 0 0 0 100000px rgba(0, 0, 0, 0.2);
		gap: 20px;
	}

	button {
		background-color: var(--success-300);
		border: 1px solid var(--success-400);
	}
</style>
