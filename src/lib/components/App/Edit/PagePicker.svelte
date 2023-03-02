<script lang="ts">
	import { CurrentProject, CurrentPage, EditModeNavigation } from '$lib/stores';
	import { updateTile } from '$lib/ts/tileActions';
	import type { Page, Project } from '$lib/types';
	import CreateNewPageModal from './CreateNewPageModal.svelte';

	let createNewPageModalShowing = false;
	let managingPages = false;

	const handlePageInteraction = (page: Page) => {
		if ($EditModeNavigation.tileid) {
			if (page.name.toLowerCase() === $CurrentPage) {
				alert('A tile cannot navigate to its parent page.');
				return;
			}

			updateTile({
				tileId: $EditModeNavigation.tileid,
				tilePage: $CurrentPage,
				newTile: { navigateTo: page.name.toLowerCase() },
				merge: true
			});

			$EditModeNavigation = { tileid: undefined, pagename: undefined };
			return;
		}
		$CurrentPage = page.name.toLowerCase();
	};
</script>

{#if createNewPageModalShowing}
	<CreateNewPageModal callback={() => (createNewPageModalShowing = false)} />
{/if}

<div class="bg-zinc-900 text-zinc-200 relative flex flex-col w-[300px]">
	<p class="p-1 px-4 bg-zinc-800 text-center border border-zinc-700 border-x-0 border-t-0">Pages</p>
	<div style="flex: 10" class="relative overflow-y-auto">
		<div class="absolute flex flex-col w-full">
			{#if $CurrentProject}
				{#each $CurrentProject.pages as page, i}
					<button
						on:click={() => handlePageInteraction(page)}
						class={`min-w-[150px] gap-2 flex items-center w-full capitalize text-left ${
							$CurrentPage === page.name ? 'bg-zinc-700' : 'bg-zinc-800'
						} ${i % 2 === 0 ? '' : 'border border-x-0 border-zinc-900'}`}
					>
						<span class="p-2">
							{#if page.name.toLowerCase() === 'home'}
								<i class="bi bi-house-fill" />
							{/if}
							<span class="text-sm">{page.name}</span>
						</span>
						{#if managingPages}
							<div class="flex-1" />
							<div class="flex">
								<button
									class="p-2 flex bg-zinc-800 hover:bg-zinc-700 items-center justify-center border border-zinc-900 border-y-0"
								>
									<i class="bi bi-pencil" />
								</button>
								<button class="p-2 flex bg-zinc-800 hover:bg-zinc-700 items-center justify-center">
									<i class="bi bi-trash" />
								</button>
							</div>
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	</div>
	<div class="flex-1" />
	<div
		class="bg-zinc-800 border border-x-0 border-b-0 border-zinc-700 flex flex-col gap-2 py-2 w-full z-20"
	>
		<button
			on:click={() => (createNewPageModalShowing = true)}
			class="bg-zinc-700 text-sm border-zinc-600 hover:bg-zinc-600 capitalize border hover:border-zinc-500 px-2 p-1 m-2 my-0 rounded-md"
			><i class="bi bi-file-earmark-plus" /> create new page</button
		>
		<button
			on:click={() => null}
			class="bg-zinc-700 text-sm border-zinc-600 hover:bg-zinc-600 capitalize border hover:border-zinc-500 px-2 p-1 m-2 my-0 rounded-md"
			><i class="bi bi-collection" /> browse community pages</button
		>
		<button
			on:click={() => (managingPages = !managingPages)}
			class={`${
				managingPages
					? 'bg-red-700 border-red-600 hover:bg-red-600 hover:border-red-500'
					: 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600 hover:border-zinc-500'
			} text-sm capitalize border  px-2 p-1 m-2 my-0 rounded-md`}
			><i class="bi bi-gear" /> {managingPages ? 'stop managing pages' : 'manage pages'}</button
		>
	</div>
</div>
