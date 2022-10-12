<script lang="ts">
	//@ts-nocheck
	import trpc from '$lib/client/trpc';
	import type { Project } from '@prisma/client';
	import ProjectCard from './ProjectCard.svelte';

  let projects: Project[] = [];
  onMount(async () => {
    projects = await trpc(fetch).query('project:explore');
  });
</script>

<span class="header"
	><h1>Explore</h1></span>
<main>
	{#each projects as project}
		<ProjectCard explore={true} {project} />
	{/each}
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	main {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}
</style>
