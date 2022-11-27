<script lang="ts">
  import ArrowRightBold from "svelte-material-icons/ArrowRightBold.svelte";
  export let editsMade = false;
  export let links = false; // used in some modals
  export let close: () => void;
  export let save: () => void;
</script>

<main
  on:click={(e) => {
    //@ts-ignore
    const tagName = e.target?.tagName;
    if (tagName === "MAIN" && !editsMade) {
      close();
    }
  }}
  on:keypress={() => null}
  style="background: rgba(0,0,0,0.5)"
  class="fixed top-0 left-0 z-40 grid h-full min-h-screen w-full place-items-center"
>
  <div
    class="flex w-full max-w-[500px] flex-col gap-2 border border-gray-700 bg-gray-800 p-4 sm:rounded-md"
  >
    <slot><!-- optional fallback --></slot>
    <div class="flex gap-4">
      <button
        class="flex-1 rounded-md border border-gray-400 bg-gray-500 p-2 text-center"
        on:click={close}>Cancel</button
      >
      <button
        disabled={!editsMade}
        class="flex-1 rounded-md border border-blue-400 bg-blue-500 p-2 text-center"
        on:click={save}>Save</button
      >
    </div>
  </div>
  {#if links}
    <div class="fixed bottom-5 right-5 flex w-[200px] flex-col gap-4">
      <a
        href="/dashboard/projects"
        class="flex items-center justify-center gap-2 rounded-md border border-gray-500 bg-gray-800 p-4 text-xl text-gray-50 shadow-xl"
        >Dashboard <ArrowRightBold /></a
      >
    </div>
  {/if}
</main>
