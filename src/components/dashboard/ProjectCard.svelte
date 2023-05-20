<script lang="ts">
	import { ActiveProject, Sentence } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	import { scale } from 'svelte/transition';
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
</script>

<div class="relative">
	<button
		on:click={() => switchProject(project.id)}
		class={`w-full h-full bg-zinc-800 border border-zinc-700 rounded-md p-2 flex flex-col gap-2 relative ${
			$ActiveProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
		}`}
	>
		<img
			src={project.imageUrl}
			class="w-full h-full aspect-video object-cover bg-zinc-900 text-zinc-900 rounded-sm"
			alt="preview"
			width={100}
		/>
		<p class="w-full text-left">
			{project.name}
		</p>
	</button>
	<div class="flex gap-1 items-center absolute top-0 right-0 -translate-y-2 translate-x-2">
		{#if editModeOn}
			<button
				disabled={false}
				in:scale
				class="w-[25px] h-[25px] bg-yellow-600 border border-yellow-500 rounded-full text-yellow-50 grid place-items-center"
			>
				<i class="bi bi-pencil text-sm" />
			</button>
			<button
				disabled={false}
				in:scale
				class="w-[25px] h-[25px] bg-red-500 border border-red-400 rounded-full text-red-50 grid place-items-center"
			>
				<i class="bi bi-trash text-sm" />
			</button>
		{/if}
	</div>
</div>
