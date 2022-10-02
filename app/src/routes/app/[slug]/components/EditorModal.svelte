<script lang="ts">
  // API
	import { create_object } from "$lib/api/aws";

  // Stores
	import { InspectedTile,
          ProjectData,
          CurrentPageIndex,
          EditedTiles } from '$lib/stores';

  // Types
  import type { Tile } from '@prisma/client';

  // Session
  import { getSession } from 'lucia-sveltekit/client';
  const session = getSession();
  
  // Bindings
  let display = $InspectedTile?.display;
  let speak = $InspectedTile?.speak;
  let image = $InspectedTile?.image;
  let navigation = $InspectedTile?.navigation;
  let files: FileList;

  // Handling uploading a file
	export const handle_upload = async (file: File) => {
		const response = await create_object(file);
    image = response.url;
	};

  // Update one tile
  const updateItem = async (tile: Tile) => {
		if(!$session?.access_token) return;

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
	};

  $: {
    // Update the item when the display changes
    updateItem({
      ...$InspectedTile,
      ...{
        display,
        speak,
        image,
        navigation
      } as Tile
    });
  }
</script>

<div>
  <span><h4>Inspector</h4> <button class="close" on:click={() => ($InspectedTile = undefined)}>Close</button></span>
  <p>Display text:</p>
  <input type="text" bind:value={display}  >
  <p>Speak text (optional):</p>
  <input type="text" bind:value={speak}>
  <p>Image (optional):</p>
  <input type="text"  bind:value={image}>
  <input bind:files type="file" />
  <button class="upload" on:click={() => handle_upload(files[0])}>Upload</button>
  <p>Navigation (optional):</p>
  <input type="text" bind:value={navigation}>
</div>

<style>
  div {
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background-color: var(--surface-2);
    border: 1px solid var(--surface-4);
    border-radius: 10px;
    max-width: 500px;
    display: flex;
    gap: 10px;
    flex-direction: column;
    box-shadow: 0 0 0 100000px rgba(0,0,0,.5);
    font-size: 20px;
  }

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close {
    background-color: var(--surface-1);
    border: 1px solid var(--surface-4);
    border-radius: 5px;
    padding: 5px;
    font-size: 15px;
    cursor: pointer;
    color: var(--text);
  }

  .close:hover {
    background-color: var(--failure);
  }

  div * {
    font-size: 20px;
  }

  input {
    background-color: var(--background);
    color: var(--text);
    border: 1px solid var(--surface-4);
    padding: 10px;
    border-radius: 5px;
  }

  .upload {
    background-color: var(--primary);
    color: var(--text);
    border: 1px solid var(--surface-4);
    padding: 10px;
    border-radius: 5px;
  }
</style>