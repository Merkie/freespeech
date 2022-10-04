<script lang="ts">
  import cytoscape from 'cytoscape';
  import { onMount } from 'svelte';
  import { remove_page } from '$lib/api/app';

  let cyElement: HTMLDivElement;

  // Stores
	import { CurrentPageIndex,
					ProjectData,
					InSettingsMenu,
          PageHistory,
          PageHistoryIndex
					} from '$lib/stores';
	import type { Tile, TilePage, Project } from '@prisma/client';

  import { getSession } from 'lucia-sveltekit/client';

  let session = getSession();

  const title_case = (str: string) => {
    return str.toLowerCase().split(' ').map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

  // Onmount script for cytoscape
  onMount(() => {
    const page_names: string[] = $ProjectData.pages.map((page) => {
      return page.name
    });
    
    let cyNodes: any[] = $ProjectData.pages.map((project) => {
      return {
        data: {
          id: title_case(project.name)
        },
      };
    });

    
    $ProjectData.pages.forEach((page) => {
      (page as TilePage & { tiles: Tile[] }).tiles.forEach((tile: Tile) => {
        if (tile.navigation && page_names.includes(tile.navigation)) {
          cyNodes.push({
            data: {
              source: title_case(page.name),
              target: title_case(tile.navigation),
              id: page.name + tile.navigation + tile.id,
            },
          });
        }
      });
    });

    let cy = cytoscape({
      container: cyElement, // container to render in
      elements: cyNodes,
      style: [{ // the stylesheet for the graph
          selector: 'node',
          style: {
            'background-color': '#2d72d2',
            'color': 'white',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'color': 'white',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 3
      }
    });

    cy.$('node').on('tap', function(e){
      var ele = e.target;
      const new_index = $ProjectData.pages.findIndex((page) => page.name.toUpperCase() === ele.id().toUpperCase());
      if(new_index < 0) return;
      $CurrentPageIndex = new_index;
      $InSettingsMenu = false;
			$PageHistory = ['HOME'];
			$PageHistoryIndex = 0;
    });

  });

  // Handle removing a page
  // TODO: add modal before deleting a page
  const handle_remove_page = async (name: string) => {
    // Get the page id
    let page_id = $ProjectData.pages.find((page) => page.name === name)?.id || -1;
    
    // Remove the page
    $ProjectData.pages = ($ProjectData.pages.filter((page) => page.name !== name) as TilePage[] & { tiles: Tile[] }[]);
    
    // Remove the page from the database
    await remove_page(page_id, $session?.access_token+'');
  }

  // Get project size in kb
  const size = new TextEncoder().encode(JSON.stringify($ProjectData)).length;
  const kiloBytes = size / 1024;
  
  // Get total term count for project
  let total_terms = 0;
  $ProjectData.pages.forEach((page) => {
    total_terms += (page as TilePage & { tiles: Tile[] } ).tiles.length;
  });
</script>

<h1>Settings</h1>
<button on:click={() => window.location.assign('/dashboard')} class="dashboard-btn">Back to Dashboard</button>

<h3>Project Vitals</h3>
<section class="vitals">
  <p><b>ID:</b> {$ProjectData.id}</p>
  <p><b>Private:</b> {!$ProjectData.public}</p>
  <p><b>Size:</b> {kiloBytes.toFixed(2)}KB</p>
  <p><b>Total Terms:</b> {total_terms}</p>
  <p><b>Total Pages:</b> {$ProjectData.pages.length}</p>
</section>

  <h3>Navigations</h3>
  <div class="navigations-wrapper">
    {#each $ProjectData.pages as page}
        <span>
          {page.name}
          <button class="remove-btn" on:click={() => handle_remove_page(page.name)}>Remove</button>
        </span>
  {/each}
  </div>
  <h3>Graph View</h3>
  <div bind:this={cyElement} />

<style>
  h1, h3, section { 
    padding: 20px;
    padding-bottom: 0px;
  }

  div {
    width: auto;
    margin: 20px;
    height: 500px;
    background: var(--web-view-background);
    border: 1px solid var(--web-view-border);
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }

  .vitals {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 40px;
  }
  
  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 20px;
    color: var(--settings-view-navigation-text);
    background: var(--settings-view-navigation-background);
    border: 1px solid var(--settings-view-navigation-border);
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    width: 200px;
  }

  .remove-btn {
    background: var(--failure);
    color: var(--failure-text);
    border: none;
    border-radius: 5px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }

  .navigations-wrapper {
    all: unset;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .dashboard-btn {
    background: var(--success);
    color: var(--success-text);
    border: none;
    border-radius: 5px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    margin-left: 20px;
    margin-top: 10px;
    width: fit-content;
    margin-left: 40px;
  }
</style>