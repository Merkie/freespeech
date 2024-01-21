<script lang="ts">
	import { ActiveProject, Sentence, openModal } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	import EditProjectModal from '$components/modals/EditProjectModal.svelte';
	import { getContext } from 'svelte';

	export let project: Project;

	const switchProject = async (id: string) => {
		$Sentence = [];
		const project = await fetch(`/api/v1/project/${id}`);
		const projectData = await project.json();
		if (projectData.error) {
			return alert(projectData.error);
		}
		$ActiveProject = projectData.project;
	};
</script>

{#if $openModal.name === 'edit-project'}
	<EditProjectModal />
{/if}

<div class="relative">
	<button
		on:click={() => switchProject(project.id)}
		class={`relative flex h-full w-full flex-col gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-2 ${
			$ActiveProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
		}`}
	>
		<img
			src={`${getContext('media_uri')}${project.imageUrl}`}
			class="aspect-video h-full w-full rounded-sm border border-zinc-300 bg-zinc-300 object-cover text-zinc-300"
			alt="preview"
			width={100}
		/>
		<p class="w-full text-left text-lg">
			{project.name}
		</p>
	</button>
</div>
