<script>
  import {
    Me,
    ModalCreateProjectOpen,
    CurrentProject,
    CurrentPage,
  } from "../../lib/client/stores";
</script>

<div class="grid w-fit grid-cols-3 grid-rows-3 flex-wrap justify-center gap-4">
  {#each $Me.projects || [] as project}
    <button
      on:click={() => {
        $CurrentProject = project;
        $CurrentPage = "Home";
        window.location.assign("/app");
      }}
      style=""
      class="min-h-[150px] grow rounded-md border border-gray-700 bg-gray-800 p-4 text-left"
    >
      <span>
        <img
          src={project.thumbnail}
          alt="thumbnail"
          class="max-h-[150px] w-full rounded-md object-cover"
        />
        <h1 class="my-2 text-xl font-medium">{project.name}</h1>
        <p class="font-light">{project.description}</p>
      </span>
    </button>
  {/each}
  <button
    class="grid min-h-[150px] w-full place-items-center rounded-md border border-dashed"
    on:click={() => ($ModalCreateProjectOpen = true)}
  >
    <span class="text-4xl">+</span>
  </button>
</div>
