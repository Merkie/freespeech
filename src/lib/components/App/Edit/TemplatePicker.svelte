<script lang="ts">
	import { CurrentProject, CurrentPage, EditModeNavigation, TemplateMode } from '$lib/stores';
	import type { Page, Project } from '$lib/types';
	import CreateNewPageModal from './CreateNewPageModal.svelte';
	import CreateNewTemplateModal from './CreateNewTemplateModal.svelte';

	let createNewTemplateModalShowing = false;
	let managingTemplates = false;

	// const handlePageInteraction = (page: Page) => {
	// 	if ($EditModeNavigation.tileid) {
	// 		if (page.name.toLowerCase() === $CurrentPage) {
	// 			alert('A tile cannot navigate to its parent page.');
	// 			return;
	// 		}
	// 		$CurrentProject = {
	// 			...$CurrentProject,
	// 			pages: ($CurrentProject as Project).pages.map((p) => {
	// 				if (p.name === $CurrentPage) {
	// 					p.tiles = p.tiles.map((tile) => {
	// 						if (tile._id === $EditModeNavigation.tileid) {
	// 							tile.navigateTo = page.name.toLowerCase();
	// 						}
	// 						return tile;
	// 					});
	// 				}
	// 				return p;
	// 			})
	// 		} as unknown as Project;
	// 		$EditModeNavigation = { tileid: undefined, pagename: undefined };
	// 		return;
	// 	}
	// 	$CurrentPage = page.name.toLowerCase();
	// };
</script>

{#if createNewTemplateModalShowing}
	<CreateNewTemplateModal callback={() => (createNewTemplateModalShowing = false)} />
{/if}

<div class="bg-zinc-900 text-zinc-200 relative flex flex-col w-[300px]">
	<p class="p-1 px-4 bg-zinc-800 text-center border border-zinc-700 border-t-0 border-x-0">
		Templates
	</p>
	<div style="flex: 10" class="relative overflow-y-auto">
		<div class="absolute flex flex-col w-full">
			{#if $CurrentProject}
				{#each $CurrentProject.templates as template, i}
					<button
						on:click={() => {
							$TemplateMode = {
								mode: 'edit',
								templateid: template._id,
								tiles: []
							};
						}}
						class={`min-w-[150px] gap-2 flex items-center w-full capitalize text-left ${
							$TemplateMode.templateid === template._id ? 'bg-zinc-700' : 'bg-zinc-800'
						} ${i % 2 === 0 ? '' : 'border border-x-0 border-zinc-900'}`}
					>
						<span class="p-2">
							<span class="text-sm">{template.name}</span>
						</span>
						{#if managingTemplates}
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
			on:click={() => (createNewTemplateModalShowing = true)}
			class="bg-zinc-700 text-sm border-zinc-600 hover:bg-zinc-600 capitalize border hover:border-zinc-500 px-2 p-1 m-2 my-0 rounded-md"
			><i class="bi bi-file-earmark-plus" /> create new template</button
		>
		<button
			on:click={() => (managingTemplates = !managingTemplates)}
			class={`${
				managingTemplates
					? 'bg-red-700 border-red-600 hover:bg-red-600 hover:border-red-500'
					: 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600 hover:border-zinc-500'
			} text-sm capitalize border  px-2 p-1 m-2 my-0 rounded-md`}
			><i class="bi bi-gear" />
			{managingTemplates ? 'stop managing templates' : 'manage templates'}</button
		>
	</div>
</div>
