<script>
  import { EditModeData } from "../../../lib/client/stores";
  import tailwindColors from "tailwindcss/colors";
  import EditHeaderSelect from "./ListBox.svelte";

  let colors = {};

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

{#if $EditModeData.tool === "color"}
  <div
    class="flex h-[40px] items-center justify-center gap-2 rounded-md bg-gray-900 px-2 sm:rounded-none"
  >
    {#each Object.keys(colors) as color}
      <button
        on:click={() => {
          $EditModeData.opts.colorShade = color;
          $EditModeData = { ...$EditModeData };
        }}
        style={`background-color: ${
          colors[color][parseInt($EditModeData.opts.colorValue || "500")]
        }`}
        class={`h-[27px] w-[27px] ${
          $EditModeData.opts.colorShade === color
            ? "rounded-full ring-2 ring-gray-50"
            : ""
        } rounded-md`}
      />
    {/each}
    <EditHeaderSelect
      defaultValue={"500"}
      values={[
        "50 (lightest)",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900 (darkest)",
      ]}
      submitValue={(value) => {
        $EditModeData.opts.colorValue = value.split(" ")[0];
        $EditModeData = { ...$EditModeData };
      }}
    />
  </div>
{/if}
