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

	let openMenuId: string | null = null;
	let confirmingDeleteId: string | null = null;
	let busy = false;

	const closeMenus = () => {
		openMenuId = null;
		confirmingDeleteId = null;
	};

	const toggleMenu = (pageId: string) => {
		openMenuId = openMenuId === pageId ? null : pageId;
		confirmingDeleteId = null;
	};

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
		closeMenus();

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
		closeMenus();

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
			closeMenus();
		}}
		title="Pages"
	>
		{#if $ProjectPagesLoading}
			<p class="text-zinc-400">Loading pages...</p>
		{:else}
			<div class="flex flex-col gap-2">
				{#each pages as p (p.id)}
					<div class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/40">
						<div class="flex items-center gap-2 px-3 py-2">
							<a
								href={`/app/project/${projectId}/${p.id}`}
								class="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 hover:text-blue-300"
							>
								{#if p.id === homePageId}
									<i class="bi bi-house-door-fill shrink-0 text-blue-400" />
								{/if}
								<span class="truncate">{p.name}</span>
							</a>

							{#if p.id === homePageId}
								<span
									class="shrink-0 rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-300"
									>Home</span
								>
							{:else}
								<button
									on:click={() => toggleMenu(p.id)}
									title="Page actions"
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-300 transition-all hover:bg-zinc-700/[60%]"
									class:bg-zinc-700={openMenuId === p.id}
								>
									<i class="bi bi-three-dots-vertical" />
								</button>
							{/if}
						</div>

						{#if openMenuId === p.id && p.id !== homePageId}
							<div class="flex flex-col border-t border-zinc-800">
								{#if confirmingDeleteId === p.id}
									<div class="flex items-center justify-between gap-2 px-3 py-2">
										<span class="text-sm text-zinc-400">Delete this page?</span>
										<div class="flex shrink-0 items-center gap-2">
											<button
												on:click={() => deletePage(p.id)}
												disabled={busy}
												class="rounded-md border border-red-500 bg-red-600 p-1 px-3 text-sm disabled:opacity-50"
												>Yes</button
											>
											<button
												on:click={() => (confirmingDeleteId = null)}
												class="rounded-md border border-zinc-600 bg-zinc-700 p-1 px-3 text-sm">No</button
											>
										</div>
									</div>
								{:else}
									<button
										on:click={() => setHomePage(p.id)}
										disabled={busy}
										class="flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-zinc-700/[50%] disabled:opacity-50"
									>
										<i class="bi bi-house-door text-zinc-400" />Set as Home
									</button>
									<button
										on:click={() => renamePage(p)}
										class="flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-zinc-700/[50%]"
									>
										<i class="bi bi-pencil text-zinc-400" />Rename
									</button>
									<button
										on:click={() => (confirmingDeleteId = p.id)}
										class="flex items-center gap-2 px-3 py-2 text-left text-sm text-red-400 transition-all hover:bg-zinc-700/[50%]"
									>
										<i class="bi bi-trash" />Delete
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</ModalShell>
{/if}
