<script lang="ts">
	import ProjectEditModal from './ProjectEditModal.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Project } from '@prisma/client';
	import { Pencil1, Trash } from '@steeze-ui/radix-icons';
	export let project: Project;
	import { getSession } from 'lucia-sveltekit/client';
	const session = getSession();

	import { edit_project } from '$lib/api/app';

	let isEditing = false;

	const updateProjectCallback = async (newProject: Project) => {
		await edit_project(project.id, newProject, $session?.access_token+'');
	};
</script>

<div>
	{#if project.image}
		<img height="80px" src={project.image} alt="">
	{/if}
	<span on:click={() => {window.location.assign('/app/' + project.id)}}>
		<h3>{project.name}</h3>
		<p>{project.description}</p>
		<p>Created {project.created_at}</p>
	</span>
	<span  style="flex: 1" />
	<button  on:click={() => isEditing = true}>
		<Icon size="30px" src={Pencil1} />
	</button>
	<Icon size="30px" src={Trash} />
</div>

{#if isEditing}
	 <ProjectEditModal {project} {updateProjectCallback} closeModalCallback={() => isEditing = false} />
{/if}

<style>
	div {
		background-color: var(--surface-1);
		border: 1px solid var(--surface-4);
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		margin-bottom: 0px;
		margin-right: 20px;
		cursor: pointer;
		display: flex;
		gap: 20px;
		align-items: center;
	}

	img {
		border-radius: 5px;
	}

	div:hover {
		background-color: var(--surface-2);
	}
</style>
