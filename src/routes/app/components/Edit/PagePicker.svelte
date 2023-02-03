<script lang="ts">
	import {
		CurrentProject,
		CurrentPage,
		EditModeNavigation,
		type ProjectExpanded
	} from '$lib/stores';
	import type { Page } from '$lib/types';
	import Modal from '../Modal.svelte';
	import CreateNewPageModal from './CreateNewPageModal.svelte';
	let createNewPageModalShowing = false;

	const handlePageInteraction = (page: Page) => {
		if ($EditModeNavigation.tileid) {
			if (page.name.toLowerCase() === $CurrentPage) {
				alert('A tile cannot navigate to its parent page.');
				return;
			}
			$CurrentProject = {
				...$CurrentProject,
				pages: ($CurrentProject as ProjectExpanded).pages.map((p) => {
					if (p.name === $CurrentPage) {
						p.tiles = p.tiles.map((tile) => {
							if (tile._id === $EditModeNavigation.tileid) {
								tile.navigateTo = page.name.toLowerCase();
							}
							return tile;
						});
					}
					return p;
				})
			} as unknown as ProjectExpanded;
			$EditModeNavigation = { tileid: undefined, pagename: undefined };
			return;
		}
		$CurrentPage = page.name.toLowerCase();
	};
</script>

{#if createNewPageModalShowing}
	<CreateNewPageModal callback={() => (createNewPageModalShowing = false)} />
{/if}

<div class="bg-zinc-900 pb-2 text-zinc-200 flex flex-col">
	<p class="p-1 px-4 bg-zinc-800 text-center gap-2 border border-zinc-700 border-x-0">Pages</p>
	<span
		class={`rounded-md w-min border bg-zinc-900  m-2 ${
			$EditModeNavigation.tileid ? ' border-blue-500 brightness-125' : 'border-zinc-900'
		}`}
	>
		{#if $CurrentProject}
			{#each $CurrentProject.pages as page}
				<button
					on:click={() => handlePageInteraction(page)}
					class="p-2 min-w-[150px] w-full capitalize">{page.name}</button
				>
			{/each}
		{/if}
	</span>

	<div class="flex-1" />
	<button
		on:click={() => (createNewPageModalShowing = true)}
		class="bg-emerald-600 border border-emerald-400 p-2 m-2 my-0 rounded-md">Create New</button
	>
</div>
