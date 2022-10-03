<script lang="ts">
  import cytoscape from 'cytoscape';
  import { onMount } from 'svelte';
  import { remove_page } from '$lib/api/app';

  let cyElement: HTMLDivElement;

  // Stores
	import { CurrentPageIndex,
					ProjectData,
					InSettingsMenu
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
      $CurrentPageIndex = $ProjectData.pages.findIndex((page) => page.name.toLowerCase() === ele.id());
      $InSettingsMenu = false;
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
<section style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: space-evenly; align-items: center;">
  <p><b>Private:</b> {!$ProjectData.public}</p>
  <p><b>Size:</b> {kiloBytes.toFixed(2)}KB</p>
  <p><b>Total Terms:</b> {total_terms}</p>
  <p><b>Total Pages:</b> {$ProjectData.pages.length}</p>
</section>

<main>
  <h3>Navigations</h3>
  {#each $ProjectData.pages as page}
      <span>
        {page.name}
        <button class="remove-btn" on:click={() => handle_remove_page(page.name)}>Remove</button>
      </span>
  {/each}
  <h3>Graph View</h3>
  <div bind:this={cyElement} />
</main>

<style>
  main {
    height: max-content;
    background-color: var(--background);
    padding-bottom: 100px;
  }

  h1, h3, section { 
    padding: 20px;
    padding-bottom: 0px;
  }

  div {
    width: auto;
    margin: 20px;
    height: 500px;
    color: var(--text);
    background: var(--surface-1);
    border: 1px solid var(--surface-4);
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }
  
  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 20px;
    color: var(--text);
    background: var(--surface-1);
    border: 1px solid var(--surface-4);
    border-radius: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }

  .remove-btn {
    background: var(--failure);
    color: var(--text);
    border: none;
    border-radius: 5px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }

  .dashboard-btn {
    background: var(--success);
    color: var(--text);
    border: none;
    border-radius: 5px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    margin-left: 20px;
    margin-top: 10px;
  }
</style>