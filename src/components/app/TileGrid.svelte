<script lang="ts">
  import {
    AppMode,
    CurrentProject,
    Me,
    CurrentPage,
  } from "../../lib/client/stores";
  import Tile from "./Tile.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import colors from "tailwindcss/colors";
  import { onMount } from "svelte";
  import type { Tile as ITile } from "@prisma/client";

  onMount(async () => {
    const res = await fetch("/api/v1/project/fetch.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: $CurrentProject.id || $Me.projects[0].id,
      }),
    });
    $CurrentProject = (await res.json()).project;
  });

  let tiles: (ITile | undefined)[] = [];

  const createTile = async ({ x, y }: { x: number; y: number }) => {
    // Get the page ID
    const pageId = $CurrentProject.pages.find(
      (p) => p.name === $CurrentPage
    )?.id;
    if (!pageId) return;

    // Update the local state first
    $CurrentProject.pages
      .find((p) => p.name === $CurrentPage)
      ?.tiles.push({
        x,
        y,
        text: "New Tile",
        image: "",
        id: "temp",
      } as ITile);
    $CurrentProject = $CurrentProject;

    // call the API to create the tile
    const response = await fetch("/api/v1/tile/create.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageId,
        x,
        y,
      }),
    });

    // consume the data from the response
    const data = await response.json();

    if (data.tile) {
      // remove the tile with the id of "temp"
      $CurrentProject.pages
        .find((p) => p.name === $CurrentPage)
        ?.tiles.splice(
          $CurrentProject.pages
            .find((p) => p.name === $CurrentPage)
            ?.tiles.findIndex((t) => t.id === "temp")!,
          1
        );
      $CurrentProject = $CurrentProject;
      // add the new tile
      $CurrentProject.pages
        .find((p) => p.name === $CurrentPage)
        ?.tiles.push(data.tile);
      // update the store
      $CurrentProject = $CurrentProject;
    }
  };

  $: try {
    tiles = Array.from(
      {
        length: ($CurrentProject.columns || 10) * ($CurrentProject.rows || 6),
      },
      (_, i) => i
    ).map((_, i) => {
      let x = (i % ($CurrentProject.columns || 10)) + 1;
      let y = Math.floor(i / ($CurrentProject.columns || 10)) + 1;
      return $CurrentProject.pages
        .find((p) => p.name === $CurrentPage)!
        .tiles.find((t) => t.x === x && t.y === y);
    });
  } catch {}
</script>

<main
  style={`
    grid-template-columns: repeat(${$CurrentProject.columns || "10"}, 1fr);
    grid-template-rows: repeat(${$CurrentProject.rows || "6"}, 1fr);
  `}
  class="grid w-full flex-1 gap-2 bg-gray-200 p-2 text-gray-900"
>
  {#if tiles.length > 0}
    {#each tiles as tile, i}
      {#if tile}
        <Tile {tile} />
      {:else if $AppMode === "edit"}
        <button
          on:click={() =>
            createTile({
              x: (i % ($CurrentProject.columns || 10)) + 1,
              y: Math.floor(i / ($CurrentProject.columns || 10)) + 1,
            })}
          class="grid h-full min-h-[100px] w-full place-items-center rounded-md border-2 border-dashed border-gray-300 text-gray-300"
        >
          <Plus size={30} />
        </button>
      {:else}
        <div />
      {/if}
    {/each}
  {/if}
</main>

<style>
  @media (max-width: 750px) {
    main {
      grid-template-columns: repeat(4, 1fr) !important;
    }
  }
</style>
