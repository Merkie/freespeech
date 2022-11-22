<script>
  import { Me } from "../../lib/stores";
  const projects = [
    { name: "Project 1", description: "Project 1's description." },
    { name: "Project 2", description: "Project 2's description." },
    { name: "Project 3", description: "Project 3's description." },
    { name: "Project 4", description: "Project 4's description." },
    { name: "Project 5", description: "Project 5's description." },
    { name: "Project 6", description: "Project 6's description." },
    { name: "Project 7", description: "Project 7's description." },
    { name: "Project 8", description: "Project 8's description." },
    { name: "Project 9", description: "Project 9's description." },
    { name: "Project 10", description: "Project 10's description." },
    { name: "Project 11", description: "Project 11's description." },
    { name: "Project 12", description: "Project 12's description." },
    { name: "Project 13", description: "Project 13's description." },
    { name: "Project 14", description: "Project 14's description." },
    { name: "Project 15", description: "Project 15's description." },
    { name: "Project 16", description: "Project 16's description." },
    { name: "Project 17", description: "Project 17's description." },
    { name: "Project 18", description: "Project 18's description." },
    { name: "Project 19", description: "Project 19's description." },
    { name: "Project 20", description: "Project 20's description." },
    { name: "Project 21", description: "Project 21's description." },
    { name: "Project 22", description: "Project 22's description." },
    { name: "Project 23", description: "Project 23's description." },
    { name: "Project 24", description: "Project 24's description." },
    { name: "Project 25", description: "Project 25's description." },
    { name: "Project 26", description: "Project 26's description." },
    { name: "Project 27", description: "Project 27's description." },
  ];
</script>

<div class="flex w-fit flex-wrap gap-4">
  {#each projects as project}
    <button
      class="min-h-[150px] w-fit rounded-md border border-gray-700 bg-gray-800 p-4 text-left"
    >
      <span>
        <img
          src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
          alt="tree"
          class="rounded-md"
          width={250}
        />
        <h1 class="my-2 text-xl font-medium">{project.name}</h1>
        <p class="font-light">{project.description}</p>
      </span>
      <span class="block text-right">Edit</span>
    </button>
  {/each}
</div>
