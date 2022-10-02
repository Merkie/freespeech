<script lang="ts">
	import type { Tile } from '@prisma/client';
	import { ArrowLeft, ArrowRight, SpeakerLoud, Trash } from '@steeze-ui/radix-icons';
  import { Icon } from '@steeze-ui/svelte-icon';
  export let navigateForwards: Function;
  export let navigateBackwards: Function;
  export let deleteSentence: Function;
  export let removeFromSentence: Function;
  export let pageName: string;
  export let canNavigateBackwards: Boolean;
  export let canNavigateForwards: Boolean;
  
  export let sentence: Tile[];

  import TileComponent from './Tile.svelte';

  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance(sentence.map(tile => tile.speak || tile.display).join(' '));
    speechSynthesis.speak(utterance);
  }
</script>

<section class="sentence-container">
  <section class="sentence-section">
    {#each sentence as sentence_tile}
      <span on:click={() => removeFromSentence(sentence_tile)}>
        <TileComponent tile={sentence_tile} />
      </span>
    {/each}
  </section>
  <button on:click={speakSentence}>
    <Icon width="50px" src={SpeakerLoud} />
  </button>
  <button on:click={() => deleteSentence()}>
    <Icon width="50px" src={Trash} />
  </button>
</section>

<div>
	<button disabled={!canNavigateBackwards} on:click={() => navigateBackwards()}>
    <Icon src={ArrowLeft} size="50px;" />
  </button>
	<h1>{pageName}</h1>
	<button disabled={!canNavigateForwards}  on:click={() => navigateForwards()}>
    <Icon src={ArrowRight} size="50px;" />
  </button>
</div>

<style>
  .sentence-section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
    gap: 20px;
    flex: 1;
    overflow-x: scroll;
    padding: 20px;
  }

  .sentence-container {
    height: 140px;
    display: flex;
  }

  span {
    min-width: 200px !important;
    max-width: 200px !important;
  }

  div {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: var(--surface-1);
    border-top: 1px solid var(--surface-4);
    border-bottom: 1px solid var(--surface-4);
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
    padding-top: 5px;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text);
  }
  button:disabled {
    opacity: .5;
  }
</style>