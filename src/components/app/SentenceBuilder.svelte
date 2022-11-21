<script>
  import Backspace from "svelte-material-icons/Backspace.svelte";
  import ViewDashboard from "svelte-material-icons/ViewDashboard.svelte";
  import colors from "tailwindcss/colors";
</script>

<div class="flex h-[100px] w-full items-center bg-gray-100 text-gray-900">
  <div class="flex-1">
    <div />
  </div>
  <button class="grid h-full place-items-center p-4">
    <Backspace color={colors.gray[900]} size={"40px"} />
  </button>
  <!-- <button
    class="mr-4 grid place-items-center rounded-md border border-gray-600 bg-gray-800 p-4"
  >
    <ViewDashboard color={colors.gray[50]} size={"40px"} />
  </button> -->
</div>
