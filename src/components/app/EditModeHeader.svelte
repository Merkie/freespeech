<script lang="ts">
  import { AppMode, EditModeToolSelection } from "../../lib/client/stores";
  import EditModeColorPicker from "./EditModeColorPicker.svelte";
  const Options: {
    name: string;
    modes?: string[];
    default?: string;
    tip?: string;
  }[] = [
    {
      name: "text",
      modes: ["display", "speak"],
      default: "display",
      tip: "Click or tap on a tile to edit its text.",
    },
    {
      name: "image",
      modes: ["add", "erase"],
      default: "add",
      tip: "Drag and drop an image onto a tile or click on a tile to set its image.",
    },
    {
      name: "color",
      modes: ["background", "border", "text"],
      default: "background",
    },
    {
      name: "move",
      modes: ["drag and drop", "swap"],
      default: "drag and drop",
    },
    {
      name: "folder",
      modes: ["add", "erase"],
      default: "add",
      tip: "Click or tap on a tile to turn it into a folder.",
    },
    {
      name: "link",
      tip: "Click or tap on a tile to link it to the same time on the previous page.",
    },
    {
      name: "delete",
      tip: "Click or tap on a tile to remove it.",
    },
  ];
</script>

{#if $AppMode === "edit"}
  <section
    class="flex min-h-[40px] w-full flex-wrap items-center gap-2 bg-gray-800 p-1 px-2 text-gray-50 sm:px-2 sm:py-0"
  >
    <p class="flex h-[40px] items-center gap-2 text-gray-300">
      Current Tool: <span
        class="h-[40px] rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
        >{$EditModeToolSelection || "none"}</span
      >
    </p>
    {#if Options.find((option) => option.name === $EditModeToolSelection)?.modes}
      <p class="flex h-[40px] items-center gap-2 text-gray-300">
        Mode: <select
          value={(
            Options.find(
              (option) => option.name === $EditModeToolSelection
            ) || { default: "" }
          ).default}
          class="h-[40px] rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
        >
          {#each (Options.find((option) => option.name === $EditModeToolSelection) || { modes: [] }).modes as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </p>
    {/if}
    {#if $EditModeToolSelection === "color"}
      <p class="flex items-center gap-2 text-gray-300">
        Color: <EditModeColorPicker />
      </p>
    {/if}
    {#if Options.find((option) => option.name === $EditModeToolSelection)?.tip}
      <p class="text-gray-300">
        Tip: {Options.find((option) => option.name === $EditModeToolSelection)
          ?.tip}
      </p>
    {/if}
  </section>
{/if}
