<script lang="ts">
  import type { Tile } from "@prisma/client";
  export let tile: Tile;
</script>

<button
  class="grid h-full w-full place-items-center rounded-md border-2 border-gray-900 bg-gray-50"
>
  {#if tile.image}
    <img src={tile.image} alt="asd" />
  {/if}
  <p>{tile.text}</p>
</button>
