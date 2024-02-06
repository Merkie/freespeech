<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { EditingProjects, ProjectBeingEdited } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	import ModalShell from './ModalShell.svelte';

	export let projects: Project[];

	const deleteProject = async (projectId: string) => {
		await fetch(`/api/v1/project/${projectId}/delete`, {
			method: 'DELETE'
		});

		await invalidateAll();
	};
</script>

{#if $EditingProjects}
	<ModalShell
		closeModal={() => {
			$EditingProjects = false;
		}}
		title="Manage Projects"
	>
		{#each projects || [] as project, index}
			<div
				class={`flex items-center gap-2 py-2 ${
					index !== 0 ? 'border border-x-0 border-b-0 border-zinc-700' : ''
				}`}
			>
				<p>{project.name}</p>
				<div class="flex-1" />

				<button
					on:click={() => {
						$EditingProjects = false;
						$ProjectBeingEdited = { ...project };
					}}
					class="rounded-md border border-yellow-500 bg-yellow-600 p-1 px-2 text-sm">Edit</button
				>
				<button
					on:click={() => deleteProject(project.id)}
					class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
				>
			</div>
		{/each}
	</ModalShell>
{/if}
