<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	export let project: Project;

	const switchProject = async (id: string) => {
		const project = await fetch(`/api/project/fetch/${id}`);
		const projectData = await project.json();
		if (projectData.error) {
			return alert(projectData.error);
		}
		$ActiveProject = projectData.project;
	};
</script>

<button
	on:click={() => switchProject(project.id)}
	class={`w-full h-full bg-zinc-800 border border-zinc-700 rounded-md p-2 flex flex-col gap-2 ${
		$ActiveProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
	}`}
>
	<img
		src={project.imageUrl}
		class="w-fit h-full aspect-video object-cover bg-zinc-900 text-zinc-900 rounded-sm"
		alt="preview"
	/>
	<p class="w-full text-left">
		{project.name}
	</p>
</button>
