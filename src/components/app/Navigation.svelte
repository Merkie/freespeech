<script lang="ts">
  // Stores
  import { AppMode } from "../../lib/client/stores";
  // Icons
  import KeyboardOutline from "svelte-material-icons/KeyboardOutline.svelte";
  import Keyboard from "svelte-material-icons/Keyboard.svelte";
  import HomeOutline from "svelte-material-icons/HomeOutline.svelte";
  import Home from "svelte-material-icons/Home.svelte";
  import PencilOutline from "svelte-material-icons/PencilOutline.svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";
  // Define data for Navigation Buttons
  const NavigationButtons: {
    name: string;
    outlineIcon: any;
    solidIcon: any;
    disabled?: boolean;
  }[] = [
    {
      name: "home",
      outlineIcon: HomeOutline,
      solidIcon: Home,
    },
    {
      name: "keyboard",
      outlineIcon: KeyboardOutline,
      solidIcon: Keyboard,
    },
    {
      name: "edit",
      outlineIcon: PencilOutline,
      solidIcon: Pencil,
    },
  ];
</script>

<section
  class="flex gap-2 border border-x-0 border-b-0 border-gray-600 bg-gray-800 p-2"
>
  {#each NavigationButtons as NavBtn}
    <button
      class={`flex flex-1 items-center justify-center gap-2 rounded-md border p-2 text-xl capitalize ${
        $AppMode === NavBtn.name
          ? "border-blue-500 bg-blue-600"
          : "border-gray-600 bg-gray-700"
      }`}
      on:click={() => ($AppMode = NavBtn.name)}
      disabled={NavBtn.disabled}
    >
      <svelte:component
        this={$AppMode === NavBtn.name ? NavBtn.solidIcon : NavBtn.outlineIcon}
        color={"white"}
        size={"25px"}
      />
      <!-- {@html `<${NavBtn.icon}${
        $AppMode === NavBtn.name ? "" : "Outline"
      } color={"white"} size={"25px"} />`} -->
      <span class="hidden sm:inline">{NavBtn.name}</span>
    </button>
  {/each}
</section>
