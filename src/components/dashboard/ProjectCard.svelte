<script lang="ts">
	import { ActiveProject, Sentence } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	import { scale } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';

	export let project: Project;
	export let editModeOn = false;

	const switchProject = async (id: string) => {
		$Sentence = [];
		const project = await fetch(`/api/project/fetch/${id}`);
		const projectData = await project.json();
		if (projectData.error) {
			return alert(projectData.error);
		}
		$ActiveProject = projectData.project;
	};

	const deleteProject = async (id: string) => {
		const project = await fetch(`/api/project/delete/${id}`, {
			method: 'DELETE'
		});
		const projectData = await project.json();
		if (projectData.error) {
			return alert(projectData.error);
		}
		invalidateAll();
	};
</script>

<div class="relative">
	<button
		on:click={() => switchProject(project.id)}
		class={`relative flex h-full w-full flex-col gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-2 ${
			$ActiveProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
		}`}
	>
		<img
			src={project.imageUrl}
			class="aspect-video h-full w-full rounded-sm border border-zinc-300 bg-zinc-300 object-cover"
			alt="preview"
			width={100}
		/>
		<p class="w-full text-left text-lg">
			{project.name}
		</p>
	</button>
	<div class="absolute right-0 top-0 flex -translate-y-2 translate-x-2 items-center gap-1">
		{#if editModeOn}
			<button
				disabled={false}
				in:scale
				class="grid h-[25px] w-[25px] place-items-center rounded-full border border-yellow-500 bg-yellow-600 text-yellow-50"
			>
				<i class="bi bi-pencil text-sm" />
			</button>
			<button
				on:click={() => deleteProject(project.id)}
				in:scale
				class="grid h-[25px] w-[25px] place-items-center rounded-full border border-red-400 bg-red-500 text-red-50"
			>
				<i class="bi bi-trash text-sm" />
			</button>
		{/if}
	</div>
</div>
