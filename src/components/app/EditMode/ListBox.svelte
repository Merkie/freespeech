<script lang="ts">
  export let values: string[];
  export let defaultValue: string;
  export let submitValue: (value: string) => void;
  let selectedValue = defaultValue;
  let open = false;
</script>

<div
  class="relative flex h-[40px] cursor-pointer items-center gap-2 rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"
  on:click={(e) => (open = true)}
  on:keypress={() => null}
>
  <p>{selectedValue}</p>
  <svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
    />
  </svg>
  {#if open}
    <div
      style="transform: translateY(100%)"
      class="absolute bottom-0 left-0 z-30 rounded-md bg-gray-900"
    >
      {#each values.filter((v) => v !== selectedValue) as value}
        <p
          on:click={() => {
            submitValue(value);
            selectedValue = value;
            setTimeout(() => (open = false), 0);
          }}
          on:keypress={() => null}
          style="transition: none;"
          class="w-full min-w-[150px] rounded-md p-2 pr-8 text-left hover:bg-gray-800 active:bg-gray-700"
        >
          {value}
        </p>
      {/each}
    </div>
  {/if}
</div>
{#if open}
  <main
    on:click={() => {
      open = false;
    }}
    on:keypress={() => (open = false)}
    class="fixed top-0 left-0 z-20 h-screen w-full "
  />
{/if}
