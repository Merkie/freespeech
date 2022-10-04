<script lang="ts">
  // @ts-nocheck
  
  // API
	import { create_object } from "$lib/api/aws";

  // Stores
	import { IsEditingNavigation,
          EditingNavigationTile,
          IsInEditMode,
          EditedTiles,
          ProjectData,
          CurrentPageIndex
          } from '$lib/stores';

  // Types
  import type { Tile } from '@prisma/client';

  // Session
	import { onMount } from "svelte";
  
  // Bindings
  let modal: HTMLElement;
  let navigation = $EditingNavigationTile?.navigation+'';

    // Update one tile
  const updateItem = async () => {
    let tile = $EditingNavigationTile;
		$ProjectData.pages[$CurrentPageIndex].tiles = $ProjectData.pages[$CurrentPageIndex].tiles.map((item) => {
			if (item.id === tile.id) {
				return tile;
			}
			return item;
		});

		// Remove the tile from editedTiles if its there
		$EditedTiles = $EditedTiles.filter((item) => {
			return item.id !== tile.id;
		});

		// Add it to the list
		$EditedTiles = [...$EditedTiles, tile];
    $EditingNavigationTile = null;
	};

  onMount(() => {
    if(modal)
      modal.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          updateItem();
        }
      });
  });
</script>

{#if $EditingNavigationTile}
  <div class="main" bind:this={modal}>
    <span><h4>Navigation Inspector</h4> <button class="close" on:click={updateItem}>Close</button></span>
    <span>
    <p>Navigation:</p>
    <input type="text" bind:value={$EditingNavigationTile.navigation}  />
    </span>
  </div>
{/if}


<style>
  .main {
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background: var(--editor-modal-background);
    border: 1px solid var(--editor-modal-border);
    color: var(--editor-modal-text);
    border-radius: 10px;
    max-width: 500px;
    display: flex;
    gap: 10px;
    flex-direction: column;
    box-shadow: 0 0 0 100000px rgba(0,0,0,.5);
    font-size: 20px;
    flex-wrap: wrap;
  }

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  div * {
    font-size: 20px;
  }

  input {
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