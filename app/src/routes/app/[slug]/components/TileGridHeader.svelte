<script lang="ts">
	import type { Tile } from '@prisma/client';
	import { ArrowLeft, ArrowRight, SpeakerLoud, Trash } from '@steeze-ui/radix-icons';
  import { Icon } from '@steeze-ui/svelte-icon';
  
  import { PageHistoryIndex, PageHistory, ProjectData, CurrentPageIndex, AppSentence } from '$lib/stores';

  import TileComponent from './Tile.svelte';

  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance($AppSentence.map(tile => tile.speak || tile.display).join(' '));
    speechSynthesis.speak(utterance);
  }

  const navigate_backwards = async () => {
		$PageHistoryIndex += 1;
		if ($PageHistoryIndex > $PageHistory.length - 1) {
			$PageHistoryIndex = $PageHistory.length - 1;
		}
		$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === $PageHistory[$PageHistoryIndex].toUpperCase());
	}

	const navigate_forwards = async () => {
		$PageHistoryIndex -= 1;
		if ($PageHistoryIndex < 0) {
			$PageHistoryIndex = 0;
		}
		$CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === $PageHistory[$PageHistoryIndex].toUpperCase());
	}

  const remove_from_sentence = (tile: Tile) => {
    $AppSentence = $AppSentence.filter((t) => t.id !== tile.id);
  }
</script>

<section class="sentence-container">
  <section class="sentence-section">
    {#each $AppSentence as sentence_tile}
      <span on:click={() => remove_from_sentence(sentence_tile)}>
        <TileComponent tile={sentence_tile} />
      </span>
    {/each}
  </section>
  <button on:click={speakSentence}>
    <Icon width="50px" src={SpeakerLoud} />
  </button>
  <button on:click={() => $AppSentence =[]}>
    <Icon width="50px" src={Trash} />
  </button>
</section>

<div>
	<button disabled={!($PageHistory.length > 1 && $PageHistoryIndex < $PageHistory.length-1)} on:click={navigate_backwards}>
    <Icon src={ArrowLeft} size="50px;" />
  </button>
	<h1>{$ProjectData.pages[$CurrentPageIndex].name}</h1>
	<button disabled={!($PageHistory.length > 1 && $PageHistoryIndex > 0)}  on:click={navigate_forwards}>
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