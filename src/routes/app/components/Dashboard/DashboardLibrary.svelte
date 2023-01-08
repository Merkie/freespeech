<script lang="ts">
	import { CurrentUser, CurrentProject } from '$lib/stores';
	import CreateProjectModal from './CreateProjectModal.svelte';

	let createProjectModalOpen = false;

	const switchProject = async (id: string) => {
		console.log(
			JSON.stringify({
				id
			})
		);
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

<main class="p-8 py-4 text-zinc-200">
	<div class="flex gap-4 mb-4 items-center">
		<p class="text-2xl">Your Projects:{' '}</p>
		<div class="flex-1" />
		<button
			on:click={() => (createProjectModalOpen = true)}
			class="bg-green-700 px-2 p-1 border border-green-600 rounded-md"
			><i class="bi bi-plus-lg" />{' '}Create New Project</button
		>
		<button class="bg-zinc-700 px-2 p-1 border border-zinc-600 rounded-md"
			><i class="bi bi-gear" />{' '}Manage Projects</button
		>
	</div>

	<div class="grid grid-cols-5 gap-4">
		{#if $CurrentUser?.projects}
			{#each $CurrentUser.projects as item}
				<div
					class="bg-zinc-700 flex flex-col gap-2 p-2 border rounded-md border-zinc-600 text-zinc-100"
				>
					<div class="w-full">
						<img
							class="h-[150px] rounded-md w-full object-cover"
							alt="Mini preview of the project"
							src="https://picsum.photos/300/300"
						/>
					</div>
					<p
						on:click={async () => await switchProject(item.id)}
						on:keypress={async (e) => {
							if (e.key === 'Enter') {
								await switchProject(item.id);
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
