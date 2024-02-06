<script lang="ts">
	import type { Project } from '@prisma/client';
	import { getContext } from 'svelte';

	export let project: Project;
</script>

<div class="relative">
	<a
		href={`/app/project/${project.id}`}
		class={`relative flex h-full w-full flex-col gap-2 rounded-md border border-zinc-300 bg-zinc-200 p-2`}
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
	</a>
</div>
