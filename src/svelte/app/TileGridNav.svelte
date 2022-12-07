<script>
  import {
    CurrentPage,
    AppMode,
    PageHistory,
    PageIndex,
  } from "../../lib/client/stores";
</script>

{#if $AppMode !== "edit"}
  <div
    class="flex w-full items-center justify-center border border-x-0 border-gray-600 bg-gray-800 p-1 text-lg text-gray-50"
  >
    <div class="flex items-center gap-4">
      <button
        disabled={$PageHistory.length <= 1 ||
          $PageIndex === $PageHistory.length - 1}
        on:click={() => ($PageIndex = $PageIndex + 1)}
      >
        <svg style="width:36px;height:36px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M10.05 16.94V12.94H18.97L19 10.93H10.05V6.94L5.05 11.94Z"
          />
        </svg>
      </button>
      <p class="min-w-[200px] text-center text-2xl">
        {$PageHistory[$PageHistory.length - 1 - $PageIndex]}
      </p>
      <button
        disabled={$PageIndex === 0}
        on:click={() => ($PageIndex = $PageIndex - 1)}
      >
        <svg style="width:36px;height:36px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z"
          />
        </svg>
      </button>
    </div>
  </div>
{/if}
