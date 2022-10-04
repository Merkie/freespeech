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
  <button class="trash" on:click={() => {$AppSentence = []; speechSynthesis.cancel();}}>
    <Icon width="40px" src={Trash} />
  </button>
  <section style={`scrollbar-width: ${$AppSentence.length > 0 ? 'thin' : 'none'}`} class="sentence-section">
    {#each $AppSentence as sentence_tile, index}
      <span on:click={() => remove_from_sentence(index)}>
        <TileComponent dummy={true} tile={sentence_tile} />
      </span>
    {/each}
  </section>
  <button class="speak" on:click={speakSentence}>
    <Icon width="40px" src={SpeakerLoud} />
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
    height: 120px;
  }

  .sentence-container {
    height: 140px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--tile-grid-sentence-builder-header-background);
    padding-right: 20px;
    padding-left: 20px;
  }

  span {
    min-width: 150px !important;
    max-width: 150px !important;
  }

  .trash {
    background: var(--failure);
    border: 1px solid var(--failure-border);
    color: var(--failure-text);
    padding: 20px;
    border-radius: 20px;
  }

  .speak {
    background: var(--success);
    border: 1px solid var(--success-border);
    color: var(--success-text);
    padding: 20px;
    border-radius: 20px;
  }
</style>