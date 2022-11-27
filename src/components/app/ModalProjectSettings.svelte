<script lang="ts">
  // Stores
  import {
    EditModeToolSelection,
    CurrentProject,
  } from "../../lib/client/stores";
  // Components
  import Modal from "../Modal.svelte";
</script>

{#if $EditModeToolSelection === "settings"}
  <Modal
    editsMade={false}
    links={true}
    close={() => ($EditModeToolSelection = "")}
    save={async () => null}
  >
    <h1 class="text-2xl font-bold">Settings</h1>
    <p class="text-gray-300">Project Name</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
    />
    <p class="text-gray-300">Project Description</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
    />
    <p class="text-gray-300">Project Columns</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
    />
    <p class="text-gray-300">Project Rows</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
    />
    <span class="flex justify-between">
      <p class="text-gray-300">Private Project</p>
      <input
        class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
        type="checkbox"
      />
    </span>
  </Modal>
{/if}
