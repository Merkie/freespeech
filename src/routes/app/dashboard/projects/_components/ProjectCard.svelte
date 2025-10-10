<script lang="ts">
	import { PUBLIC_R2_URL } from '$env/static/public';
	import { LocalSettings } from '$ts/client/stores';
	import type { Project } from '$ts/common/types';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	let selected = $derived($LocalSettings.lastVisitedProjectId === project.id);
</script>

<div class={`relative`}>
	<a
		href={`/app/project/${project.id}`}
		class={`relative flex h-fit w-full flex-col gap-4 rounded-lg border border-zinc-300 bg-zinc-200 p-2 shadow-sm ${selected ? 'border-blue-200 ring-4 ring-blue-200 ring-offset-2 ring-offset-zinc-100' : ''}`}
	>
		<img
			src={`${PUBLIC_R2_URL}${project.imageUrl}`}
			class="aspect-video w-full rounded-md bg-zinc-100 object-cover p-1 text-zinc-100"
			alt="preview"
			width={100}
		/>
		<div class="flex w-full items-center gap-2 text-lg">
			<p class="flex-1 truncate whitespace-nowrap">{project.name}</p>
			{#if selected}
				<div class="rounded-md bg-blue-500 p-1 px-2 text-sm font-bold text-white shadow-md">
					SELECTED
				</div>
			{/if}
		</div>
		{#if selected}
			<div class="pointer-events-none absolute left-0 top-0 h-full w-full bg-blue-200/[20%]"></div>
		{/if}
	</a>
</div>
