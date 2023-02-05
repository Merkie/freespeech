<script lang="ts">
	import { CurrentUser, CurrentProject } from '$lib/stores';
	import { scale } from 'svelte/transition';
	import CreateProjectModal from './CreateProjectModal.svelte';
	import DeleteProjectModal from './DeleteProjectModal.svelte';

	let createProjectModalOpen = false;
	let managingProjects = false;
	let deleteProjectModalOpen = false;
	let deleteProjectId = '';

	const switchProject = async (id: string) => {
		const response = await fetch('/api/v1/project/read', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id
			})
		}).then((res) => res.json());

		if (response.project) {
			$CurrentProject = response.project;
		}
	};
</script>

{#if createProjectModalOpen}
	<CreateProjectModal callback={() => (createProjectModalOpen = false)} />
{/if}

{#if deleteProjectModalOpen}
	<DeleteProjectModal
		projectid={deleteProjectId}
		callback={() => (deleteProjectModalOpen = false)}
	/>
{/if}

<main class="p-8 py-4 text-zinc-200">
	<div class="flex gap-4 mb-4 items-center">
		<p class="text-2xl">Your Projects:{' '}</p>
		<div class="flex-1" />
		<button
			on:click={() => (createProjectModalOpen = true)}
			class="bg-green-700 px-2 p-1 border border-green-600 rounded-md"
			><i class="bi bi-plus-lg" />{' '}Create New Project</button
		>
		<button
			on:click={() => (managingProjects = !managingProjects)}
			class={managingProjects
				? 'bg-red-600 px-2 p-1 border border-red-500 rounded-md'
				: 'bg-zinc-700 px-2 p-1 border border-zinc-600 rounded-md'}
			><i class="bi bi-gear" />{managingProjects
				? ' Stop Managing Projects'
				: ' Manage Projects'}</button
		>
	</div>

	<div class="grid grid-cols-5 gap-4">
		{#if $CurrentUser?.projects}
			{#each $CurrentUser.projects as item}
				<div
					class={`relative flex flex-col gap-2 p-2 border rounded-md  ${
						$CurrentProject?._id === item._id
							? 'bg-blue-500 border-blue-400 text-blue-100'
							: 'bg-zinc-700 border-zinc-600 text-zinc-100'
					}`}
				>
					{#if managingProjects}
						<button
							transition:scale
							on:click={() => {
								deleteProjectModalOpen = true;
								deleteProjectId = item._id;
							}}
							class="bg-red-500 cursor-pointer grid place-items-center border border-red-600 w-[30px] h-[30px] absolute right-0 top-0 rounded-full translate-x-2 -translate-y-2"
						>
							<i class="bg bi-trash pointer-events-none" />
						</button>
					{/if}

					<div class="w-full">
						<img
							class="h-[150px] rounded-md w-full object-fit bg-zinc-100 text-zinc-100"
							alt="Mini preview of the project"
							src={item.image}
						/>
					</div>
					<p
						on:click={async () => await switchProject(item._id.toString())}
						on:keypress={async (e) => {
							if (e.key === 'Enter') {
								await switchProject(item._id.toString());
							}
						}}
						class="hover:underline cursor-pointer"
					>
						{item.name}
					</p>
				</div>
			{/each}
		{/if}
	</div>
</main>
