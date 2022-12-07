<script lang="ts">
  import { ModalData, Me } from "../../lib/client/stores";
  import Modal from "../Modal.svelte";

  let name: string;
  let description: string;
  let columns: number;
  let rows: number;
  let editsMade = false;

  const createProject = async () => {
    if (!editsMade) {
      alert("Please fill out all fields");
      return;
    }
    const response = await fetch("/api/v1/project/create.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        columns,
        rows,
      }),
    });
    const data = await response.json();
    if (data.success) {
      $Me.projects.push(data.project);
      $Me = $Me;
      $ModalData.createProject = false;
      $ModalData = $ModalData;
    }
  };
</script>

{#if $ModalData.createProject}
  <Modal
    {editsMade}
    links={false}
    close={() => {
      $ModalData.createProject = false;
      $ModalData = $ModalData;
    }}
    save={createProject}
  >
    <h1 class="text-2xl font-bold">Settings</h1>
    <p class="text-gray-300">Project Name</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
      bind:value={name}
      on:input={() => {
        editsMade = name.length > 0;
      }}
    />
    <p class="text-gray-300">Project Description</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="text"
      bind:value={description}
      on:input={() => {
        editsMade = description.length > 0;
      }}
    />
    <p class="text-gray-300">Project Columns</p>
    <input
      class="gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
      placeholder="8"
      bind:value={columns}
      on:input={() => {
        editsMade = !!columns;
      }}
    />
    <p class="text-gray-300">Project Rows</p>
    <input
      class="gb-gray-100 mb-2 rounded-md border-gray-200 p-2 text-gray-700"
      type="number"
      placeholder="6"
      bind:value={rows}
      on:input={() => {
        editsMade = !!rows;
      }}
    />
  </Modal>
{/if}
