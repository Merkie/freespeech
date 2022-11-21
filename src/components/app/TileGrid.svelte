<script>
  import { AppMode } from "../../lib/stores";
  import Tile from "./Tile.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import colors from "tailwindcss/colors";
</script>

<div
  class="grid w-full flex-1 grid-cols-10 grid-rows-6 gap-2 bg-gray-200  p-2 text-gray-900"
>
  <Tile />
  {#if $AppMode === "edit"}
    {#each Array.from({ length: 59 }, (_, i) => i) as item}
      <button
        class="grid h-full w-full place-items-center rounded-md border-2 border-dashed border-slate-300"
      >
        <Plus size={"30px"} color={colors.gray[300]} />
      </button>
    {/each}
  {/if}
</div>
