<script lang="ts">
  // Props
  export let tile: Tile;
  // Stores
  import {
    AppMode,
    CurrentProject,
    CurrentPage,
    PageHistory,
    PageIndex,
    EditModeData,
    Sentence,
  } from "../../lib/client/stores";
  // Assets
  import AddPic from "../../../public/add.png";
  import tailwindColors from "tailwindcss/colors";
  // Types
  import type { Tile } from "@prisma/client";
  import type { PageWithTiles } from "../../lib/types";
  // Helpers
  import { url2base64 } from "../../lib/client/api.svelte";
  // Bindings
  let tileTextRef: HTMLParagraphElement;
  let fileInputRef: HTMLInputElement;
  let dragging = false;
  let img: string;

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
      $EditModeData.queue[tile.id] = tile;
    };

    // Update the store
    $EditModeData = { ...$EditModeData };
  };

  // Handles interaction when tile is clicked
  const handleInteraction = async () => {
    // if the user is in edit mode
    if ($AppMode === "edit") {
      // Text
      if ($EditModeData.tool === "text" && $EditModeData.tile?.id !== tile.id) {
        $EditModeData = { ...$EditModeData, tile };
        setTimeout(() => {
          tileTextRef.focus();
          //@ts-ignore
          document.execCommand("selectall", null, false);
        }, 0);
      }
      // Image
      if ($EditModeData.tool === "image") {
        if (tile.image) {
          tile.image = "";
          $EditModeData.queue[tile.id] = { ...tile };
        } else {
          fileInputRef.click();
        }
      }
      // Color
      if ($EditModeData.tool === "color") {
        const color =
          // @ts-ignore
          tailwindColors[$EditModeData.opts?.colorShade][
            $EditModeData.opts?.colorValue
          ];
        //@ts-ignore
        tile[$EditModeData.opts?.colorType + "Color"] = color;
        $EditModeData.queue[tile.id] = { ...tile };
      }
      // Swap
      if ($EditModeData.tool === "move") {
        if ($EditModeData.tile) {
          $EditModeData.queue[tile?.id] = {
            ...$EditModeData.tile,
            id: tile?.id,
            x: tile.x,
            y: tile.y,
          };
          $EditModeData.queue[$EditModeData.tile?.id] = {
            ...tile,
            id: $EditModeData.tile?.id,
            x: $EditModeData.tile.x,
            y: $EditModeData.tile.y,
          };
          //@ts-ignore
          $CurrentProject.pages.find((page) => page.id === tile.pageId)!.tiles =
            $CurrentProject.pages
              .find((page) => page.id === tile.pageId)!
              .tiles.filter((t) => t.id !== $EditModeData.tile?.id);
          $CurrentProject.pages
            .find((page) => page.id === tile.pageId)!
            .tiles.push({
              ...tile,
              id: $EditModeData.tile?.id,
              x: $EditModeData.tile.x,
              y: $EditModeData.tile.y,
            });

          $CurrentProject.pages.find((page) => page.id === tile.pageId)!.tiles =
            $CurrentProject.pages
              .find((page) => page.id === tile.pageId)!
              .tiles.filter((t) => t.id !== tile?.id);
          $CurrentProject.pages
            .find((page) => page.id === tile.pageId)!
            .tiles.push({
              ...$EditModeData.tile,
              id: tile?.id,
              x: tile.x,
              y: tile.y,
            });

          $CurrentProject = $CurrentProject;
          $EditModeData = { ...$EditModeData, tile: undefined };
        } else {
          $EditModeData = { ...$EditModeData, tile };
        }
      }
      // Accent
      if ($EditModeData.tool === "accent") {
        tile.accented = !tile.accented;
        $EditModeData.queue[tile.id] = { ...tile };
        $EditModeData = { ...$EditModeData };
      }
      // Folder
      if ($EditModeData.tool === "folder") {
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
          $EditModeData.queue[tile.id] = { ...tile };
        }
      }
      // Delete
      if ($EditModeData.tool === "delete") {
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
      } else {
        $Sentence = [...$Sentence, tile];
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

<div
  on:click={handleInteraction}
  on:keypress={() => null}
  on:dragover={() => {
    if ($AppMode === "edit" && $EditModeData.tool === "image") {
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
  class="btn relative flex flex-col  rounded-md"
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
    <div class="relative h-1/2 flex-1">
      <img
        src={dragging ? AddPic : tile.image}
        alt="Loading..."
        width="40%"
        class="absolute left-1/2 h-full -translate-x-1/2 object-contain pt-1"
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
        $EditModeData.tool === "text" &&
        $EditModeData.tile?.id === tile.id}
      on:input={(e) => {
        $EditModeData.queue = {
          ...$EditModeData.queue,
          [tile.id]: {
            ...tile,
            // @ts-ignore
            [$EditModeData.opts?.speakText ? "speakText" : "text"]:
              e.target?.innerText,
          },
        };
      }}
    >
      {$EditModeData.opts?.speakText &&
      $EditModeData.tool === "text" &&
      $AppMode === "edit"
        ? tile.speakText || ""
        : tile.text}
    </p>
  </div>
</div>

<!-- File input (hidden) -->
<input
  on:input={(e) => {
    //@ts-ignore
    uploadImage(e.target.files[0]);
  }}
  class="hidden"
  type="file"
  bind:this={fileInputRef}
/>

<style>
  .btn:active {
    transform: translateY(2px) scale(0.98);
  }
</style>
