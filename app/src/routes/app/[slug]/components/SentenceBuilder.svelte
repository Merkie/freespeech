<script lang="ts">
  // Icons
  import { Icon } from '@steeze-ui/svelte-icon';
  import { SpeakerLoud, Trash } from '@steeze-ui/radix-icons';

  // Stores
  import { AppSentence } from '$lib/stores';

  // Components
  import TileComponent from './Tile.svelte';


  // Speak the entire sentence
  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance($AppSentence.map(tile => tile.modifier || tile.speak || tile.display).join(' ').replaceAll('+ ', '').replaceAll(' +', ''));
    speechSynthesis.speak(utterance);
  }

  // Remove a word from the sentence given the index
  const remove_from_sentence = (index: number) => {
    $AppSentence.splice(index, 1);
    $AppSentence = [...$AppSentence];
  }
</script>

<section class="sentence-container">
  <section style={`scrollbar-width: ${$AppSentence.length > 0 ? 'thin' : 'none'}`} class="sentence-section">
    {#each $AppSentence as sentence_tile, index}
      <span on:click={() => remove_from_sentence(index)}>
        <TileComponent dummy={true} tile={sentence_tile} />
      </span>
    {/each}
  </section>
  <button on:click={speakSentence}>
    <Icon width="50px" src={SpeakerLoud} />
  </button>
  <button on:click={() => {$AppSentence = []; speechSynthesis.cancel();}}>
    <Icon width="50px" src={Trash} />
  </button>
</section>

<style>
  .sentence-section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
    gap: 20px;
    flex: 1;
    padding: 20px;
    overflow-y: hidden;
    overflow-x: scroll;
  }

  .sentence-container {
    height: 140px;
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--tile-grid-sentence-builder-header-background);
    padding-right: 20px;
  }

  span {
    min-width: 200px !important;
    max-width: 200px !important;
  }
</style>