<script lang="ts">
	// @ts-nocheck

	import { Icon } from '@steeze-ui/svelte-icon';
	import { TriangleDown, TriangleLeft } from '@steeze-ui/radix-icons';

	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();

	// API
	import { create_object } from '$lib/api/aws';


	// Stores
	import {
		IsEditingNavigation,
		EditingNavigationTile,
		IsInEditMode,
		EditedTiles,
		ProjectData,
		CurrentPageIndex
	} from '$lib/stores';

	// Types
	import type { Tile } from '@prisma/client';

	// Session
	import { onMount } from 'svelte';
	import { create_page } from '$lib/api/app';

	// Bindings
	let modal: HTMLElement;
	let navigation = $EditingNavigationTile?.navigation + '';
	let isMakingNewPage = false;
	let inherit_columns = true;
	let inherit_dimensions = true;
	let inherit_template = true;
	let page_name = '';

	// Update one tile
	const updateItem = async () => {
		let tile = $EditingNavigationTile;
		$ProjectData.pages[$CurrentPageIndex].tiles = $ProjectData.pages[$CurrentPageIndex].tiles.map(
			(item) => {
				if (item.id === tile.id) {
					return tile;
				}
				return item;
			}
		);

		// Remove the tile from editedTiles if its there
		$EditedTiles = $EditedTiles.filter((item) => {
			return item.id !== tile.id;
		});

		// Add it to the list
		$EditedTiles = [...$EditedTiles, tile];
		$EditingNavigationTile = null;
	};

	onMount(() => {
		if (modal)
			modal.addEventListener('keypress', function (e) {
				if (e.key === 'Enter') {
					updateItem();
				}
			});
	});
</script>

{#if $EditingNavigationTile}
	<div class="main" bind:this={modal}>
		<span
			><h4>Inspector</h4>
			<button class="close" on:click={updateItem}>Close</button></span
		>
		<p>Navigation:</p>
		<select
			on:change={(e) => ($EditingNavigationTile.navigation = e.target.value)}
			value={$EditingNavigationTile.navigation || ''}
		>
			<option value={''}>None</option>
			{#each $ProjectData.pages as page}
				<option value={page.name}>{page.name}</option>
			{/each}
		</select>

		<span style="cursor: pointer;" on:click={() => (isMakingNewPage = !isMakingNewPage)}
			><p>New page settings</p>
			<Icon size="25px" src={isMakingNewPage ? TriangleLeft : TriangleDown} /></span
		>

		{#if !isMakingNewPage}
			<span
				><p>Page name:</p>
				<input type="text" placeholder="My awesome page" bind:value={page_name} /></span
			>
			<div class="boolean-box">
				<span
					><p />
					<input
						checked={inherit_columns && inherit_dimensions && inherit_template}
						on:change={(e) => {
							inherit_columns,
								inherit_dimensions,
								(inherit_template = inherit_columns = inherit_dimensions = e.target.checked);
						}}
						type="checkbox"
					/></span
				>
				<span
					><p>Inherit column count:</p>
					<input type="checkbox" bind:checked={inherit_columns} /></span
				>
				<span
					><p>Inherit dimensions:</p>
					<input type="checkbox" bind:checked={inherit_dimensions} /></span
				>
				<span
					><p>Inherit template:</p>
					<input type="checkbox" bind:checked={inherit_template} /></span
				>
			</div>
		{/if}

		{#if !isMakingNewPage}
			<button
				on:click={async () => {
					$EditingNavigationTile.navigation = page_name;
					await create_page(
						page_name,
						{ inherit_columns, inherit_dimensions, inherit_template },
						$session?.access_token + ''
					);
				}}>Create New Page</button
			>
		{/if}
	</div>
{/if}

<style>
	.main {
		position: absolute;
		z-index: 999;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		background: var(--editor-modal-background);
		border: 1px solid var(--editor-modal-border);
		color: var(--editor-modal-text);
		border-radius: 5px;
		max-width: 500px;
		display: flex;
		gap: 10px;
		flex-direction: column;
		box-shadow: 0 0 0 100000px rgba(0, 0, 0, 0.75);
		font-size: 20px;
		flex-wrap: wrap;
		min-width: min(400px, 90%);
	}

	/* select {
    display: block;
    width: 100%;
    flex: 1;
  } */

	span {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

	.close {
		background: var(--failure);
		border: 1px solid var(--failure-border);
		border-radius: 5px;
		padding: 5px;
		font-size: 15px;
		cursor: pointer;
		color: var(--failure-text);
	}

	.boolean-box {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 10px 0;
		background: var(--editor-modal-input-background);
		border: 1px solid var(--editor-modal-border);
		border-radius: 5px;
		padding: 10px;
	}

	div * {
		font-size: 20px;
	}

	input,
	select {
		background: var(--editor-modal-input-background);
		color: var(--editor-modal-input-text);
		border: 1px solid var(--editor-modal-input-border);
		padding: 10px;
		border-radius: 5px;
	}

	.upload {
		background: var(--upload-button-background);
		color: var(--upload-button-text);
		border: 1px solid var(--upload-button-border);
		padding: 10px;
		border-radius: 5px;
		width: 100%;
	}
</style>
