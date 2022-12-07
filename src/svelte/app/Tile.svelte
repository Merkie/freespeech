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
  // Icons
  import Link from "svelte-material-icons/Link.svelte";
  // Bindings
  let tileTextRef: HTMLParagraphElement;
  let fileInputRef: HTMLInputElement;
  let dragging = false;
  let img: string;

  // Uploads an image to the server and returns the url

  // Handles interaction when tile is clicked
  const handleInteraction = (e: { target: { innerText: string } }) => {
    $EditModeData.queue = {
      ...$EditModeData.queue,
      [tile.id]: {
        ...tile,
        [$EditModeData.opts?.speakText ? "speakText" : "text"]:
          e.target?.innerText,
      },
    };
    $EditModeData = $EditModeData;
  };

  // Handle tile text input
  const handleTextChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    tile.text = target.value;
    $EditModeData.queue[tile.id] = { ...tile };
    $EditModeData = { ...$EditModeData };
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

  <!-- Link -->
  {#if tile.link && $AppMode === "edit"}
    <div
      style="background: rgba(0,0,0,0.5)"
      class="absolute top-0 left-0 grid h-full w-full place-items-center"
    >
      <Link size={50} color={"white"} />
    </div>
  {/if}

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
      on:input={handleTextChange}
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
