<script lang="ts">
	import { LocalSettings } from '$ts/client/stores';
	import type { Project } from '@prisma/client';
	import { getContext } from 'svelte';

	export let project: Project;

	$: selected = $LocalSettings.lastVisitedProjectId === project.id;
</script>

<div class={`relative p-4`}>
	<a
		href={`/app/project/${project.id}`}
		class={`relative flex h-fit w-full flex-col gap-4  rounded-md border border-zinc-300 bg-zinc-200 p-2 ${selected ? 'ring-4 ring-blue-200 ring-offset-4 ring-offset-zinc-100' : ''}`}
	>
		<img
			src={`${getContext('media_uri')}${project.imageUrl}`}
			class="aspect-video w-full rounded-sm border border-zinc-300 bg-zinc-300 object-cover text-zinc-300"
			alt="preview"
			width={100}
		/>
		<p class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-lg">
			{project.name}
		</p>
	</a>
</div>
