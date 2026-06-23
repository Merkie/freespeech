<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { TilePage } from '$ts/common/types';
	import ModalShell from './ModalShell.svelte';
	import {
		EditingPages,
		PageBeingEdited,
		ProjectPages,
		ProjectPagesLoading,
		requestBoardRefresh
	} from '$ts/client/stores';
	import { page } from '$app/stores';
	import api from '$ts/client/api';

	export let pages: TilePage[];
	export let projectId: string;
	export let homePageId: string | null = null;

	let confirmingDeleteId: string | null = null;
	let busy = false;

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

	const setHomePage = async (pageId: string) => {
		if (busy) return;
		busy = true;
		const response = await api.project.edit(projectId, { homePageId: pageId });
		busy = false;

		if (response.error) return alert(response.error);

		await invalidateAll();
		requestBoardRefresh();
	};

	const renamePage = (p: TilePage) => {
		$PageBeingEdited = { ...p };
		$EditingPages = false;
	};

	const deletePage = async (pageId: string) => {
		if (busy) return;
		busy = true;
		const response = await api.page.delete(pageId);
		busy = false;
		confirmingDeleteId = null;

		if (response.error) return alert(response.error);

		if ($page.url.pathname.includes(pageId)) window.location.assign(`/app/project/${projectId}`);

		// Also update the store
		$ProjectPages = $ProjectPages.filter((p) => p.id !== pageId);
		await invalidateAll();
		requestBoardRefresh();
	};
</script>

{#if $EditingPages}
	<ModalShell
		closeModal={() => {
			$EditingPages = false;
			confirmingDeleteId = null;
		}}
		title="Pages"
	>
		{#if $ProjectPagesLoading}
			<p class="text-zinc-400">Loading pages...</p>
		{:else}
			<div class="flex flex-col gap-2">
				{#each pages as p (p.id)}
					<div
						class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2"
					>
						<div class="flex min-w-0 flex-1 items-center gap-2">
							{#if p.id === homePageId}
								<i class="bi bi-house-door-fill text-blue-400" />
							{/if}
							<span class="truncate">{p.name}</span>
							{#if p.id === homePageId}
								<span
									class="rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-300"
									>Home</span
								>
							{/if}
						</div>

						{#if confirmingDeleteId === p.id}
							<div class="flex shrink-0 items-center gap-2">
								<span class="text-sm text-zinc-400">Delete page?</span>
								<button
									on:click={() => deletePage(p.id)}
									disabled={busy}
									class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm disabled:opacity-50"
									>Yes</button
								>
								<button
									on:click={() => (confirmingDeleteId = null)}
									class="rounded-md border border-zinc-600 bg-zinc-700 p-1 px-2 text-sm">No</button
								>
							</div>
						{:else}
							<div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
								<a
									href={`/app/project/${projectId}/${p.id}`}
									class="rounded-md border border-blue-500 bg-blue-600 p-1 px-2 text-sm">View</a
								>
								{#if p.id !== homePageId}
									<button
										on:click={() => setHomePage(p.id)}
										disabled={busy}
										title="Set as home page"
										class="flex items-center gap-1 rounded-md border border-zinc-600 bg-zinc-700 p-1 px-2 text-sm disabled:opacity-50"
									>
										<i class="bi bi-house-door text-xs" />Set Home
									</button>
									<button
										on:click={() => renamePage(p)}
										class="rounded-md border border-yellow-500 bg-yellow-600 p-1 px-2 text-sm"
										>Rename</button
									>
									<button
										on:click={() => (confirmingDeleteId = p.id)}
										class="rounded-md border border-red-500 bg-red-600 p-1 px-2 text-sm">Delete</button
									>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</ModalShell>
{/if}
