<script lang="ts">
  // Stores
  import {
    ConjugatingTile,
    AppProject,
    CurrentPageId
  } from '$lib/client/stores';

  import Modal from '$lib/client/components/Modal.svelte';
  import Tile from './Tile.svelte';
	import trpc from '$lib/client/trpc';
	import Spinner from '$lib/client/components/Spinner.svelte';

  let conjugations: string[] = [];
  let loading = false;

  const get_conjugations = async () => {
    conjugations = [];
    loading = true;
    // Fetch conjugations
    conjugations = await trpc(fetch).mutation('openaiconjugate', ($ConjugatingTile?.speak_text || $ConjugatingTile?.display_text)+'') || [];
    // current word
    const current_word = ($ConjugatingTile?.speak_text || $ConjugatingTile?.display_text)+'';
    // filter current word
    conjugations = conjugations.filter((conjugation) => conjugation.toLowerCase() !== current_word.toLowerCase());
    // only allow letters in every word
    conjugations = conjugations.filter((conjugation) => conjugation.match(/^[a-zA-Z]+$/));
    // filter dupelicates
    conjugations = conjugations.filter((conjugation, index) => conjugations.indexOf(conjugation) === index);
    // only take first 5
    conjugations = conjugations.slice(0, 5);

    // save them to the tile
    //@ts-ignore
    $AppProject.pages.find((page) => page.id === $CurrentPageId).tiles.find((tile) => tile.id === $ConjugatingTile?.id).conjugations = conjugations;
    
    loading = false;

    // Send it to the server
    //@ts-ignore
    await trpc(fetch).mutation('tile:edit', {
      ...$ConjugatingTile,
      conjugations 
    })
  }

  const close_modal = () => {
    $ConjugatingTile = null;
    conjugations = [];
  }

  $: {
    if ($ConjugatingTile && conjugations.length === 0) {
      if($ConjugatingTile.conjugations.length === 0) {
        get_conjugations();
      } else {
        conjugations = $ConjugatingTile.conjugations;
      }
    }
  }
</script>

{#if $ConjugatingTile && conjugations.length > 0}
<Modal title="" {close_modal}>
  <span on:keypress={() => null} style={`--rows: ${Math.floor((conjugations.length + 2) / 3)};`}>
    {#if loading}
      <Spinner />
    {/if}
    <Tile tile={$ConjugatingTile} dummy={false} />
    {#each conjugations as word}
      <Tile dummy={true} tile={{...$ConjugatingTile, display_text: word, image: ''}} />
    {/each}
    <button on:click={get_conjugations} class="refresh">
      <i class='bx bx-refresh' ></i>
    </button>
  </span>
</Modal>
{/if}

{#if loading && conjugations.length === 0}
  <Spinner />
{/if}

<style>
  span {
    position: fixed;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
    gap: 10px;
    background-color: var(--tiles-background);
    padding: 20px;
    border-radius: 5px;
    border: 2px solid var(--tiles-border);
  }
  .refresh {
    background-color: var(--tile-background);
    border: 2px var(--tiles-border) solid;
    color: var(--tiles-text);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
  }
</style>