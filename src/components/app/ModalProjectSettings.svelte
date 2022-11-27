<script lang="ts">
  // Stores
  import {
    EditModeToolSelection,
    CurrentProject,
    Loading,
  } from "../../lib/client/stores";
  // Components
  import Modal from "../Modal.svelte";

  let name = $CurrentProject.name;
  let description = $CurrentProject.description;
  let columns = $CurrentProject.columns;
  let rows = $CurrentProject.rows;
  let isPrivate = $CurrentProject.visibility === "private";
  let editsMade = false;

  const saveChanges = async () => {
    if (!editsMade) {
      alert("Please fill out all fields");
      return;
    }

    $Loading = true;
    const response = await fetch("/api/v1/project/edit.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: $CurrentProject.id,
        name,
        description,
        columns,
        rows,
        visibility: isPrivate ? "private" : "public",
      }),
    });

    const data = await response.json();
    if (data.success) {
      $CurrentProject = { ...$CurrentProject, ...data.project };
      $EditModeToolSelection = "";
    }
    $Loading = false;
  };
</script>

{#if $EditModeToolSelection === "settings"}
  <Modal
    {editsMade}
    links={true}
    close={() => ($EditModeToolSelection = "")}
    save={saveChanges}
  >
    <h1 class="text-2xl font-bold">Settings</h1>
    <p class="text-gray-300">Project Name</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
      bind:value={name}
      on:input={() => {
        editsMade = name !== $CurrentProject.name;
      }}
    />
    <p class="text-gray-300">Project Description</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
      bind:value={description}
      on:input={() => {
        editsMade = description !== $CurrentProject.description;
      }}
    />
    <p class="text-gray-300">Project Columns</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
      bind:value={columns}
      on:input={() => {
        editsMade = columns !== $CurrentProject.columns;
      }}
    />
    <p class="text-gray-300">Project Rows</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
      bind:value={rows}
      on:input={() => {
        editsMade = rows !== $CurrentProject.rows;
      }}
    />
    <span class="flex justify-between">
      <p class="text-gray-300">Private Project</p>
      <input
        class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
        type="checkbox"
        bind:checked={isPrivate}
        on:input={() => {
          editsMade = isPrivate !== ($CurrentProject.visibility === "private");
        }}
      />
    </span>
  </Modal>
{/if}
