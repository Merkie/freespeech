<script lang="ts">
  // Stores
  import { AppMode, EditModeToolSelection } from "../../lib/client/stores";
  // Icon
  import FormatText from "svelte-material-icons/FormatText.svelte";
  import Image from "svelte-material-icons/Image.svelte";
  import ImageOutline from "svelte-material-icons/ImageOutline.svelte";
  import Palette from "svelte-material-icons/Palette.svelte";
  import PaletteOutline from "svelte-material-icons/PaletteOutline.svelte";
  import CursorMove from "svelte-material-icons/CursorMove.svelte";
  import Bookmark from "svelte-material-icons/Bookmark.svelte";
  import BookmarkOutline from "svelte-material-icons/BookmarkOutline.svelte";
  import EyeOff from "svelte-material-icons/EyeOff.svelte";
  import EyeOffOutline from "svelte-material-icons/EyeOffOutline.svelte";
  import Folder from "svelte-material-icons/Folder.svelte";
  import FolderOutline from "svelte-material-icons/FolderOutline.svelte";
  import Link from "svelte-material-icons/Link.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
  import Cog from "svelte-material-icons/Cog.svelte";
  import CogOutline from "svelte-material-icons/CogOutline.svelte";

  const EditButtons: { name: string; outlineIcon: any; solidIcon: any }[] = [
    {
      name: "text",
      outlineIcon: FormatText,
      solidIcon: FormatText,
    },
    {
      name: "image",
      outlineIcon: ImageOutline,
      solidIcon: Image,
    },
    {
      name: "color",
      outlineIcon: PaletteOutline,
      solidIcon: Palette,
    },
    {
      name: "move",
      outlineIcon: CursorMove,
      solidIcon: CursorMove,
    },
    {
      name: "accent",
      outlineIcon: BookmarkOutline,
      solidIcon: Bookmark,
    },
    // {
    //   name: "invisible",
    //   outlineIcon: EyeOffOutline,
    //   solidIcon: EyeOff,
    // },
    {
      name: "folder",
      outlineIcon: FolderOutline,
      solidIcon: Folder,
    },
    {
      name: "link",
      outlineIcon: Link,
      solidIcon: Link,
    },
    {
      name: "delete",
      outlineIcon: DeleteOutline,
      solidIcon: Delete,
    },
    {
      name: "settings",
      outlineIcon: CogOutline,
      solidIcon: Cog,
    },
  ];
</script>

{#if $AppMode === "edit"}
  <div class="z-10 flex w-[95px] flex-col bg-gray-800">
    <div
      class="w-full border border-x-0 border-t-0 border-gray-700 bg-gray-900 p-1 text-center"
    >
      <h1>Tools</h1>
    </div>
    <div class={`flex flex-1  justify-center`}>
      <div class="flex h-fit flex-wrap justify-center gap-2 pt-1">
        {#each EditButtons as EditBtn}
          <button
            on:click={() => ($EditModeToolSelection = EditBtn.name)}
            class={`rounded-md border  p-1 ${
              $EditModeToolSelection === EditBtn.name
                ? "border-gray-600 bg-gray-900"
                : "border-gray-800"
            }`}
          >
            <svelte:component
              this={EditBtn.outlineIcon}
              color={$EditModeToolSelection === EditBtn.name
                ? "#f9fafb"
                : "#9ca3af"}
              size={"25px"}
            />
          </button>

          <!-- <button >
             -->
          <!-- {#if $EditModeToolSelection === EditBtn.name}
          <p class="text-sm capitalize">
            {EditBtn.name}
          </p>
                    class={`border shadow-md ${
            $EditModeToolSelection === EditBtn.name
              ? "border-gray-600 bg-gray-700 text-gray-50"
              : "border-gray-700"
          } flex h-fit flex-col items-center justify-center gap-2 rounded-md`}
        {/if} -->
          <!-- </button> -->
        {/each}
      </div>
    </div>
  </div>
{/if}
