<script lang="ts">
  import {
    AppMode,
    EditModeToolSelection,
    TileEditQueue,
    Loading,
    EditingSpeakText,
    EditModeColorSelectedType,
  } from "../../lib/client/stores";
  import EditModeColorPicker from "./EditModeColorPicker.svelte";
  import EditHeaderSelect from "./EditHeaderSelect.svelte";
  import { saveAllTiles } from "./../../lib/client/api.svelte";
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

    {#if $EditModeToolSelection === "text"}
      <p>Mode:</p>
      <select
        class="h-[40px] rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
        on:input={(e) => {
          //@ts-ignore
          $EditingSpeakText = e.target.value === "speak";
        }}
      >
        <option value="display">Display</option>
        <option value="speak">Speak</option>
      </select>
      <p>Tip: Click or tap on a tile to edit its text.</p>
    {/if}

    {#if $EditModeToolSelection === "color"}
      <p>Mode:</p>
      <EditHeaderSelect
        defaultValue={"border"}
        values={["border", "background", "text"]}
        submitValue={(value) => ($EditModeColorSelectedType = value)}
      />
      <EditModeColorPicker />
    {/if}

    {#if Object.keys($TileEditQueue).length > 0}
      <button
        on:click={saveAllTiles}
        class="rounded-md border border-green-500 bg-green-600 p-1"
      >
        Save Changes
      </button>
    {/if}
  </section>
{/if}
