<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { TilePage } from '@prisma/client';
	import ModalShell from './ModalShell.svelte';

	import { EditingPages, PageBeingEdited } from '$ts/client/stores';
	import { page } from '$app/stores';

	export let pages: TilePage[];
	export let projectId: string;

	const deletePage = async (pageId: string) => {
		await fetch(`/api/v1/page/${pageId}/delete`, {
			method: 'DELETE'
		}).then((res) => res.json());

		if ($page.url.pathname.includes(pageId)) window.location.assign(`/app/project/${projectId}`);

		await invalidateAll();
	};
</script>

{#if $EditingPages}
	<ModalShell closeModal={() => ($EditingPages = false)} title="Edit Pages">
		{#each pages as page, index}
			<div
				class={`flex items-center gap-2 py-2 ${
					index !== 0 ? 'border border-x-0 border-b-0 border-zinc-700' : ''
				}`}
			>
				<p>{page.name}</p>
				<div class="flex-1" />
				<a
					href={`/app/project/${projectId}/${page.id}`}
					class="rounded-md border border-blue-500 bg-blue-600 p-1 px-2 text-sm">View</a
				>
				{#if page.name !== 'Home'}
					<button
						on:click={() => {
							$PageBeingEdited = { ...page };
							$EditingPages = false;
						}}
						class="rounded-md border border-yellow-500 bg-yellow-600 p-1 px-2 text-sm">Edit</button
					>
					<button
						on:click={() => deletePage(page.id)}
						class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
					>
				{/if}
			</div>
		{/each}
	</ModalShell>
{/if}
