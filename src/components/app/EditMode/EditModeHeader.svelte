<script lang="ts">
  import { AppMode, Loading, EditModeData } from "../../../lib/client/stores";
  import ColorPicker from "./ColorPicker.svelte";
  import EditHeaderSelect from "./ListBox.svelte";
  import { saveAllTiles } from "./../../../lib/client/api.svelte";
</script>

{#if $AppMode === "edit"}
  <section
    class="border-y-o flex min-h-[40px] w-full flex-wrap items-center gap-2 border border-gray-700 bg-gray-800 p-1 px-2 text-gray-50 sm:px-2 sm:py-0"
  >
    <p class="flex h-[40px] items-center gap-2 text-gray-300">
      Current Tool: <span
        class="h-[40px] rounded-md border border-y-0 border-gray-700 bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
        >{$EditModeData.tool || "none"}</span
      >
    </p>

    {#if $EditModeData.tool === "text"}
      <p>Mode:</p>
      <select
        class="h-[40px] rounded-md border border-y-0 border-gray-700 bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
        on:input={(e) => {
          //@ts-ignore
          $EditModeData.opts.speakText = e.target.value === "speak";
          $EditModeData = { ...$EditModeData };
        }}
      >
        <option value="display">Display</option>
        <option value="speak">Speak</option>
      </select>
      <p>Tip: Click or tap on a tile to edit its text.</p>
    {/if}

    {#if $EditModeData.tool === "color"}
      <p>Mode:</p>
      <EditHeaderSelect
        defaultValue={"border"}
        values={["border", "background", "text"]}
        submitValue={(value) => {
          //@ts-ignore
          $EditModeData.opts.colorType = value;
          $EditModeData = { ...$EditModeData };
        }}
      />
      <ColorPicker />
    {/if}

    {#if Object.keys($EditModeData.queue).length > 0}
      <button
        on:click={saveAllTiles}
        class="rounded-md border border-green-500 bg-green-600 p-1"
      >
        Save Changes
      </button>
    {/if}
  </section>
{/if}
