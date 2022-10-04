<script lang="ts">
  // Icons
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ArrowLeft, ArrowRight } from '@steeze-ui/radix-icons';

  // Stores
  import { PageHistoryIndex, PageHistory, ProjectData, CurrentPageIndex, AppSentence } from '$lib/stores';

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
</script>

<main>
  <div>
    <button class="navigation-btn" disabled={!($PageHistory.length > 1 && $PageHistoryIndex < $PageHistory.length-1)} on:click={navigate_backwards}>
      <Icon src={ArrowLeft} size="30px;" />
    </button>
    <h1>{$ProjectData.pages[$CurrentPageIndex].name || 'Home'}</h1>
    <!-- <h1>Home</h1> -->
    <button class="navigation-btn" disabled={!($PageHistory.length > 1 && $PageHistoryIndex > 0)}  on:click={navigate_forwards}>
      <Icon src={ArrowRight} size="30px;" />
    </button>
  </div>
</main>

<style>
  h1 {
    color: var(--tile-grid-header-text);
    font-size: 20px;
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