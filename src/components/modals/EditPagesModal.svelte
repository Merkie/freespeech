<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { TilePage } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';
	import { EditingPages, PageBeingEdited, ProjectPages, ProjectPagesLoading } from '$ts/client/stores';
	import { page } from '$app/stores';
	import api from '$ts/client/api';

	export let pages: TilePage[];
	export let projectId: string;

	// Fetch pages when modal opens if not already loaded
	$: if ($EditingPages && pages.length === 0 && !$ProjectPagesLoading) {
		(async () => {
			$ProjectPagesLoading = true;
			try {
				const { pages: fetchedPages } = await api.project.listPages(projectId);
				$ProjectPages = fetchedPages;
			} finally {
				$ProjectPagesLoading = false;
			}
		})();
	}

	const deletePage = async (pageId: string) => {
		await api.page.delete(pageId);

		if ($page.url.pathname.includes(pageId)) window.location.assign(`/app/project/${projectId}`);

		// Also update the store
		$ProjectPages = $ProjectPages.filter((p) => p.id !== pageId);
		await invalidateAll();
	};
</script>

{#if $EditingPages}
	<ModalShell closeModal={() => ($EditingPages = false)} title="Pages">
		{#if $ProjectPagesLoading}
			<p class="text-zinc-400">Loading pages...</p>
		{:else}
			{#each pages as page, index (page.id)}
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
		{/if}
	</ModalShell>
{/if}
