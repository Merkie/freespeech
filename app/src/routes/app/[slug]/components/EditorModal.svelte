<script lang="ts">
	import { create_object } from "$lib/api/aws";
	import type { Tile } from "@prisma/client";
  export let tile: Tile;
  export let updateTileCallback: Function;
  export let closeModalCallback: Function;

  let display = tile.display;
  let speak = tile.speak;
  let image = tile.image;
  let navigation = tile.navigation;

  let files: FileList;

	export const handle_upload = async (file: File) => {
		const response = await create_object(file);
    image = response.url;
	};

  $: {
    updateTileCallback({
      ...tile,
      display,
      speak,
      image,
      navigation
    });
  }
</script>

<div>
  <span><h4>Inspector</h4> <button on:click={() => closeModalCallback()}>Close</button></span>
  <p>Display text:</p>
  <input type="text" bind:value={display}  >
  <p>Speak text (optional):</p>
  <input type="text" bind:value={speak}>
  <p>Image (optional):</p>
  <input type="text"  bind:value={image}>
  <input bind:files type="file" />
  <button on:click={() => handle_upload(files[0])}>Upload</button>
  <p>Navigation (optional):</p>
  <input type="text" bind:value={navigation}>
</div>

<style>
  div {
    position: absolute;
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
  }
</style>