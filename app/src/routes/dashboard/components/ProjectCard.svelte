<script lang="ts">
	import type { Project } from '@prisma/client';
	export let project: Project;
</script>

<div>
	<a href={'/app/' + project.id}>{project.name}</a>
	<p>{project.description}</p>
</div>

<style>
	div {
		background-color: var(--surface-1);
		border: 1px solid var(--surface-4);
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		margin-bottom: 0px;
		margin-right: 20px;
	}
</style>
