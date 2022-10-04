<script lang="ts">
  // Icons
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ArrowLeft, ArrowRight, SpeakerLoud, Trash } from '@steeze-ui/radix-icons';

  // Stores
  import { PageHistoryIndex, PageHistory, ProjectData, CurrentPageIndex, AppSentence } from '$lib/stores';

  // Components
  import TileComponent from './Tile.svelte';

  // Speak the entire sentence
  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance($AppSentence.map(tile => tile.modifier || tile.speak || tile.display).join(' ').replaceAll('+ ', '').replaceAll(' +', ''));
    speechSynthesis.speak(utterance);
  }

  // Navigate to the previous page
  const navigate_backwards = async () => {
		$PageHistoryIndex += 1;
		if ($PageHistoryIndex > $PageHistory.length - 1) {
			$PageHistoryIndex = $PageHistory.length - 1;
		}
		$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === $PageHistory[$PageHistoryIndex].toUpperCase());
	}

  // Navigate to the next page
	const navigate_forwards = async () => {
		$PageHistoryIndex -= 1;
		if ($PageHistoryIndex < 0) {
			$PageHistoryIndex = 0;
		}
		$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === $PageHistory[$PageHistoryIndex].toUpperCase());
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

<div>
	<button class="navigation-btn" disabled={!($PageHistory.length > 1 && $PageHistoryIndex < $PageHistory.length-1)} on:click={navigate_backwards}>
    <Icon src={ArrowLeft} size="50px;" />
  </button>
	<h1>{$ProjectData.pages[$CurrentPageIndex].name}</h1>
	<button class="navigation-btn" disabled={!($PageHistory.length > 1 && $PageHistoryIndex > 0)}  on:click={navigate_forwards}>
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

  h1 {
    color: var(--tile-grid-header-text);
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
    background: var(--tile-grid-header-background);
    border-top: 1px solid var(--tile-grid-header-border);
    border-bottom: 1px solid var(--tile-grid-header-border);
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
    padding-top: 5px;
    overflow-y: hidden;
  }
  button {
    background: var(--tile-grid-header-button-background);
    border: var(--tile-grid-header-button-border) 1px solid;
    color: var(--tile-grid-header-button-text-color);
    padding: 10px;
    border-radius: 5px;
  }

  .navigation-btn {
    color: var(--tile-grid-header-navigation-button-color);
    border: none;
    background: transparent;
  }
  button:disabled {
    opacity: .5;
  }
</style>