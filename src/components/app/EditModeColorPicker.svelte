<script>
  import { EditModeToolSelection } from "../../lib/stores";
  import tailwindColors from "tailwindcss/colors";

  let colors = {};
  let selectedValue = "500";
  let selectedShade = "";

  for (const color in tailwindColors) {
    if (
      [
        "gray",
        "red",
        "orange",
        // "amber",
        "yellow",
        // "lime",
        "green",
        // "emerald",
        // "teal",
        "cyan",
        // "sky",
        "blue",
        // "indigo",
        // "violet",
        "purple",
        // "fuchsia",
        "pink",
        // "rose",
      ].includes(color)
    ) {
      colors[color] = tailwindColors[color];
    }
  }
</script>

{#if $EditModeToolSelection === "color"}
  <div
    class="flex h-[40px] items-center justify-center gap-2 rounded-md bg-gray-900 px-2 sm:rounded-none"
  >
    {#each Object.keys(colors) as color}
      <button
        on:click={() => (selectedShade = color)}
        style={`background-color: ${colors[color][parseInt(selectedValue)]}`}
        class={`h-[27px] w-[27px] ${
          selectedShade === color ? "rounded-full ring-2 ring-slate-50" : ""
        } rounded-md`}
      />
    {/each}
    <select bind:value={selectedValue} class="bg-transparent">
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="200">200</option>
      <option value="300">300</option>
      <option value="400">400</option>
      <option value="500">500</option>
      <option value="600">600</option>
      <option value="700">700</option>
      <option value="800">800</option>
      <option value="900">900</option>
    </select>
  </div>
{/if}
