<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { EditingProjects, ProjectBeingEdited } from '$ts/client/stores';
	import type { Project } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';
	import api from '$ts/client/api';
	import { writable } from 'svelte/store';

	export let projects: Project[];

	let showConfirmation = writable(false);
	let projectToDelete: string | null = null;

	const confirmDelete = (projectId: string) => {
		projectToDelete = projectId;
		showConfirmation.set(true);
	};

	const deleteProject = async () => {
		if (projectToDelete) {
			await api.project.delete(projectToDelete);
			await invalidateAll();
			// Close the confirmation dialog after deletion
			showConfirmation.set(false);
			projectToDelete = null;
		}
	};

	const cancelDelete = () => {
		showConfirmation.set(false);
		projectToDelete = null;
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
					on:click={() => confirmDelete(project.id)}
					class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
				>
			</div>
		{/each}
	</ModalShell>
{/if}

{#if $showConfirmation}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-white p-6 rounded-md shadow-lg">
			<p class="text-center mb-4">Are you sure you want to delete this project?</p>
			<div class="flex justify-between">
				<button
					on:click={deleteProject}
					class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
				>Delete</button>
				<button
					on:click={cancelDelete}
					class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
				>Cancel</button>
			</div>
		</div>
	</div>
{/if}

