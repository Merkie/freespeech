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
  class={`relative grid h-[130px] w-full place-items-center rounded-md border-2 text-lg ${
    dragging
      ? "border-green-400 bg-green-500 text-gray-50"
      : "border-gray-900 bg-gray-50 "
  }`}
>
  {#if tile.navigationPageName}
    <div
      style={"left: -2px; border-top-right-radius: 10px; border-top-left-radius: 10px;" +
        `${
          tile.backgroundColor
            ? "background: " + tile.backgroundColor + ";"
            : ""
        }${tile.borderColor ? "border-color: " + tile.borderColor + ";" : ""}`}
      class="absolute top-1 h-[10px] w-1/2 -translate-y-full border-2 border-b-0 border-gray-900 bg-gray-50"
    />
  {/if}

  <div
    class="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-sm"
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
        <img width="70px" src={img} alt="Loading..." />
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
