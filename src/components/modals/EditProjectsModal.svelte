<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { EditingProjects, ProjectBeingEdited } from '$ts/client/stores';
	import type { Project } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';
	import api from '$ts/client/api';

	export let projects: Project[];

	const deleteProject = async (projectId: string) => {
		await api.project.delete(projectId);
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
		{#each projects || [] as project, index (project.id)}
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
