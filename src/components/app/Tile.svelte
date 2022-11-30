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
    PageHistory,
    PageIndex,
  } from "../../lib/client/stores";
  import AddPic from "../../../public/add.png";
  import type { Tile } from "@prisma/client";
  import Plus from "svelte-material-icons/Plus.svelte";
  import tailwindColors from "tailwindcss/colors";
  import { onMount } from "svelte";
  import type { PageWithTiles } from "../../lib/types";
  export let tile: Tile;

  let tileTextRef: HTMLParagraphElement;
  let fileInput: HTMLInputElement;
  let dragging = false;
  let img: string;

  const url2base64 = async (url: string) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
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
      // Folder
      if ($EditModeToolSelection === "folder") {
        const resposne = await fetch("/api/v1/page/create.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tile.text,
            projectId: $CurrentProject.id,
          }),
        });
        const data = await resposne.json();
        if (data.success) {
          $CurrentProject.pages = [
            ...$CurrentProject.pages,
            {
              id: data.page.id,
              name: data.page.name,
              projectId: data.page.projectId,
              tiles: [],
            } as unknown as PageWithTiles,
          ];
          $CurrentProject = $CurrentProject;
          tile.navigationPageName = data.page.name;
          $TileEditQueue[tile.id] = { ...tile };
        }
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
    } else if ($AppMode === "home") {
      if (tile.navigationPageName) {
        $CurrentPage = tile.navigationPageName;

        // If the user has already messed around with the page history, reset it to avoid conflicts
        if ($PageIndex !== 0) {
          $PageIndex = 0;
          $PageHistory = ["Home"];
        }

        // If the page is the last page the user visited, don't add it to the history, pop it
        if ($PageHistory.at(-1) === $CurrentPage) {
          $PageHistory.pop();
        } else {
          $PageHistory.push($CurrentPage);
        }

        // Update the store
        $PageHistory = $PageHistory;
      }
    }
  };

  $: try {
    if (tile.image) {
      url2base64(tile.image).then((base64) => {
        img = "data:image/png;base64," + (base64 + "").split(",")[1];
      });
    }
  } catch (e) {
    console.error(e);
  }
</script>

<button
  on:click={handleInteraction}
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
    uploadImage(e.dataTransfer?.files[0]);
  }}
  style={`
    --bg: ${tile.backgroundColor || tailwindColors["gray"]["50"]};
    --border: ${tile.borderColor || tailwindColors["gray"]["900"]};
    --text: ${tile.textColor || tailwindColors["gray"]["900"]};
    background: var(--bg);
    border: 2px solid var(--border);
    color: var(--text);
  `}
  class="relative flex h-full w-full flex-col rounded-md"
>
  <!-- Folder piece -->
  {#if tile.navigationPageName}
    <div
      style="left: -2px; border-top-right-radius: 10px; border-top-left-radius: 10px; background: var(--bg); border-color: var(--border);"
      class="absolute top-1 h-[10px] w-1/2 -translate-y-full border-2 border-b-0"
    />
  {/if}

  <!-- Accent -->
  <div class="absolute top-0 left-0 h-full w-full overflow-hidden">
    <div
      style="background: var(--border)"
      class={`absolute h-[50px] w-[50px] rotate-45 ${
        tile.accented
          ? "-top-[30px] -right-[30px]"
          : "-top-[50px] -right-[50px]"
      }`}
    />
  </div>

  <!-- Image -->
  {#if tile.image || dragging}
    <div class="h-1/2 w-full flex-1">
      <img
        src={dragging ? AddPic : tile.image}
        alt="Loading..."
        width="40%"
        class="mx-auto h-full object-contain pt-1"
      />
    </div>
  {/if}

  <!-- Text -->
  <div
    class={`grid h-${
      tile.image ? "1/2" : "full"
    } w-full flex-1 place-items-center text-xl`}
  >
    <p
      bind:this={tileTextRef}
      contenteditable={$AppMode === "edit" &&
        $EditModeToolSelection === "text" &&
        $TextEditTileId === tile.id}
      on:input={(e) => {
        $TileEditQueue = {
          ...$TileEditQueue,
          [tile.id]: {
            ...tile,
            // @ts-ignore
            [$EditingSpeakText ? "speakText" : "text"]: e.target?.innerText,
          },
        };
      }}
    >
      {$EditingSpeakText &&
      $EditModeToolSelection === "text" &&
      $AppMode === "edit"
        ? tile.speakText || ""
        : tile.text}
    </p>
  </div>
</button>

<!-- File input (hidden) -->
<input
  on:input={(e) => {
    //@ts-ignore
    uploadImage(e.target.files[0]);
  }}
  class="hidden"
  type="file"
  bind:this={fileInput}
/>

<!-- <button

  
  style={dragging
    ? ""
    : `${
        tile.backgroundColor ? "background: " + tile.backgroundColor + ";" : ""
      } ${tile.textColor ? "color: " + tile.textColor + ";" : ""} ${
        tile.borderColor ? "border-color: " + tile.borderColor + ";" : ""
      } ${$EditModeSwapTile?.id === tile.id ? "transform: scale(0.9);" : ""}`}
  class={`relative grid h-full w-full place-items-center rounded-md border-2 text-lg ${
    dragging
      ? "border-green-400 bg-green-500 text-gray-50"
      : "border-gray-900 bg-gray-50 "
  }`}
>


  <div
    class="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-sm"
  >
    

    {#if dragging}
      <Plus size={30} />
    {:else}
      {#if tile.image}
        <img width="70px" src={img} alt="Loading..." />
      {/if}
      
    {/if}
  </div>
</button> -->
