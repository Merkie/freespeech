<script lang="ts">
  import {
    AppMode,
    EditModeToolSelection,
    TextEditTileId,
    TileEditQueue,
    EditingSpeakText,
    CurrentProject,
    CurrentPage,
    EditModeColorSelectedShade,
    EditModeColorSelectedValue,
    EditModeColorSelectedType,
    EditModeSwapTile,
  } from "../../lib/client/stores";
  import type { Tile } from "@prisma/client";
  import Plus from "svelte-material-icons/Plus.svelte";
  import tailwindColors from "tailwindcss/colors";
  export let tile: Tile;

  let tileTextRef: HTMLParagraphElement;
  let fileInput: HTMLInputElement;
  let dragging = false;

  const uploadImage = async (file: File) => {
    tile.image = "Loading...";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      const response = await fetch("/api/v1/file/upload.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64,
          ext: file.name.split(".").pop(),
        }),
      });
      const { url } = await response.json();
      tile.image = url;
      // send to server to update
      $TileEditQueue[tile.id] = { ...tile };
    };
  };

  // Handles interaction when tile is clicked
  const handleInteraction = async () => {
    // if the user is in edit mode
    if ($AppMode === "edit") {
      // Text
      if ($EditModeToolSelection === "text" && $TextEditTileId !== tile.id) {
        $TextEditTileId = tile.id;
        setTimeout(() => {
          tileTextRef.focus();
          //@ts-ignore
          document.execCommand("selectall", null, false);
        }, 0);
      }
      // Image
      if ($EditModeToolSelection === "image") {
        if (tile.image) {
          tile.image = "";
          $TileEditQueue[tile.id] = { ...tile };
        } else {
          fileInput.click();
        }
      }
      // Color
      if ($EditModeToolSelection === "color") {
        const color =
          // @ts-ignore
          tailwindColors[$EditModeColorSelectedShade][
            $EditModeColorSelectedValue
          ];
        //@ts-ignore
        tile[$EditModeColorSelectedType + "Color"] = color;
        $TileEditQueue[tile.id] = { ...tile };
      }
      // Swap
      if ($EditModeToolSelection === "move") {
        if ($EditModeSwapTile) {
          $TileEditQueue[tile?.id] = {
            ...$EditModeSwapTile,
            id: tile?.id,
            x: tile.x,
            y: tile.y,
          };
          $TileEditQueue[$EditModeSwapTile?.id] = {
            ...tile,
            id: $EditModeSwapTile?.id,
            x: $EditModeSwapTile.x,
            y: $EditModeSwapTile.y,
          };
          //@ts-ignore
          $CurrentProject.pages.find((page) => page.id === tile.pageId)!.tiles =
            $CurrentProject.pages
              .find((page) => page.id === tile.pageId)!
              .tiles.filter((t) => t.id !== $EditModeSwapTile?.id);
          $CurrentProject.pages
            .find((page) => page.id === tile.pageId)!
            .tiles.push({
              ...tile,
              id: $EditModeSwapTile?.id,
              x: $EditModeSwapTile.x,
              y: $EditModeSwapTile.y,
            });

          $CurrentProject.pages.find((page) => page.id === tile.pageId)!.tiles =
            $CurrentProject.pages
              .find((page) => page.id === tile.pageId)!
              .tiles.filter((t) => t.id !== tile?.id);
          $CurrentProject.pages
            .find((page) => page.id === tile.pageId)!
            .tiles.push({
              ...$EditModeSwapTile,
              id: tile?.id,
              x: tile.x,
              y: tile.y,
            });

          $CurrentProject = $CurrentProject;
          $EditModeSwapTile = null;
        } else {
          $EditModeSwapTile = tile;
        }
      }
      // Accent
      if ($EditModeToolSelection === "accent") {
        tile.accented = !tile.accented;
        $TileEditQueue[tile.id] = { ...tile };
      }
      // Delete
      if ($EditModeToolSelection === "delete") {
        // Update locally
        $CurrentProject.pages.find((page) => page.id === tile.pageId)!.tiles =
          $CurrentProject.pages
            .find((page) => page.id === tile.pageId)!
            .tiles.filter((t) => t.id !== tile.id);
        $CurrentProject = $CurrentProject;
        // Send deletion to server
        await fetch("/api/v1/tile/delete.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: tile.id,
          }),
        });
      }
    }
  };
</script>

<button
  on:dragover={() => {
    if ($AppMode === "edit") {
      dragging = true;
    }
  }}
  on:dragexit={() => {
    dragging = false;
  }}
  on:drop={(e) => {
    dragging = false;
    //@ts-ignore
    uploadImage(e.dataTransfer.files[0]);
  }}
  on:click={handleInteraction}
  style={dragging
    ? ""
    : `${
        tile.backgroundColor ? "background: " + tile.backgroundColor + ";" : ""
      } ${tile.textColor ? "color: " + tile.textColor + ";" : ""} ${
        tile.borderColor ? "border-color: " + tile.borderColor + ";" : ""
      } ${$EditModeSwapTile?.id === tile.id ? "transform: scale(0.9);" : ""}`}
  class={`grid h-full min-h-[100px] w-full place-items-center rounded-md border-2 ${
    dragging
      ? "border-green-400 bg-green-500 text-gray-50"
      : "border-gray-900 bg-gray-50 "
  }`}
>
  <div
    class="relative grid h-full w-full place-items-center overflow-hidden rounded-sm"
  >
    <div
      style={`${
        tile.borderColor ? "background: " + tile.borderColor + ";" : ""
      }`}
      class={`absolute h-[50px] w-[50px] rotate-45 bg-gray-900 ${
        tile.accented
          ? "-top-[30px] -right-[30px]"
          : "-top-[50px] -right-[50px]"
      }`}
    />
    <input
      on:input={(e) => {
        //@ts-ignore
        uploadImage(e.target.files[0]);
      }}
      class="hidden"
      type="file"
      bind:this={fileInput}
    />
    {#if dragging}
      <Plus size={30} />
    {:else}
      {#if tile.image}
        <img width="50px" src={tile.image} alt="Loading..." />
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
    {/if}
  </div>
</button>
