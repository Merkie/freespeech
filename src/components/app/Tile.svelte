<script lang="ts">
  import {
    AppMode,
    EditModeToolSelection,
    TextEditTileId,
    TileEditQueue,
    EditingSpeakText,
  } from "../../lib/client/stores";
  import type { Tile } from "@prisma/client";
  export let tile: Tile;

  let tileTextRef: HTMLParagraphElement;

  // Handles interaction when tile is clicked
  const handleInteraction = async () => {
    // if the user is in edit mode
    if ($AppMode === "edit") {
      if ($EditModeToolSelection === "text" && $TextEditTileId !== tile.id) {
        $TextEditTileId = tile.id;
        setTimeout(() => {
          tileTextRef.focus();
          //@ts-ignore
          document.execCommand("selectall", null, false);
        }, 0);
      }
      // const response = await fetch("/api/v1/tile/edit.json", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     tile: { ...tile, text: "sup" },
      //   }),
      // });
      // const data = await response.json();
    }
  };
</script>

<button
  on:click={handleInteraction}
  class="grid h-full w-full place-items-center rounded-md border-2 border-gray-900 bg-gray-50"
>
  {#if tile.image}
    <img src={tile.image} alt="asd" />
  {/if}
  <p
    bind:this={tileTextRef}
    contenteditable={$AppMode === "edit" &&
      $EditModeToolSelection === "text" &&
      $TextEditTileId === tile.id}
    on:input={(e) => {
      $TileEditQueue = $EditingSpeakText
        ? {
            ...$TileEditQueue,
            //@ts-ignore
            [tile.id]: { ...tile, speakText: e.target.innerText },
          }
        : {
            ...$TileEditQueue,
            //@ts-ignore
            [tile.id]: { ...tile, text: e.target.innerText },
          };
    }}
  >
    {$EditingSpeakText &&
    $EditModeToolSelection === "text" &&
    $AppMode === "edit"
      ? tile.speakText || ""
      : tile.text}
  </p>
</button>
