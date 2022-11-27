<script>
  import { Me, ModalCreateProjectOpen } from "../../lib/client/stores";
</script>

<div class="flex w-fit flex-wrap justify-center gap-4">
  {#each $Me.projects || [] as project}
    <button
      style=""
      class="min-h-[150px] grow rounded-md border border-gray-700 bg-gray-800 p-4 text-left"
    >
      <span>
        <img
          src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
          alt="tree"
          class="max-h-[150px] w-full rounded-md object-cover sm:min-w-[250px]"
        />
        <h1 class="my-2 text-xl font-medium">{project.name}</h1>
        <p class="font-light">{project.description}</p>
      </span>
      <span class="block text-right">Edit</span>
    </button>
  {/each}
  <button
    class="grid min-h-[150px] w-[250px] place-items-center rounded-md border border-dashed"
    on:click={() => ($ModalCreateProjectOpen = true)}
  >
    <span class="text-4xl">+</span>
  </button>
</div>
