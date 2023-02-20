<script lang="ts">
	import { CurrentProject, CurrentPage, EditModeNavigation, TemplateMode } from '$lib/stores';
	import type { Page, Project } from '$lib/types';
	import CreateNewPageModal from './CreateNewPageModal.svelte';
	import CreateNewTemplateModal from './CreateNewTemplateModal.svelte';

	let createNewPageModalShowing = false;
	let managingPages = false;
</script>

{#if createNewPageModalShowing}
	<CreateNewTemplateModal callback={() => (createNewPageModalShowing = false)} />
{/if}

<div class="bg-zinc-900 text-zinc-200 flex flex-col">
	<p class="p-1 px-4 bg-zinc-800 text-center gap-2 border border-zinc-700 border-x-0">Templates</p>
	<span
		class={`rounded-md flex flex-col border bg-zinc-900 ${
			$EditModeNavigation.tileid ? ' border-blue-500 brightness-125' : 'border-zinc-900'
		}`}
	>
		{#if $CurrentProject}
			{#each $CurrentProject.templates as template, i}
				<button
					on:click={() => {
						$TemplateMode = {
							mode: 'edit',
							templateid: template._id
						};
					}}
					class={`p-2 min-w-[150px] gap-2 flex items-center w-full capitalize text-left ${
						(i + 1) % 2 === 0 ? 'bg-zinc-800' : ''
					}`}
				>
					<span>{template.name}</span>
					{#if managingPages}
						<div class="flex-1" />
						<button
							class="bg-yellow-600 rounded-full w-[20px] h-[20px] flex items-center justify-center border border-yellow-500"
						>
							<i style="font-size: 10px" class="bi bi-pencil" />
						</button>
						<button
							class="bg-red-600 rounded-full w-[20px] h-[20px] flex items-center justify-center border border-red-500"
						>
							<i class="bi bi-x text-lg" />
						</button>
					{/if}
				</button>
			{/each}
		{/if}
	</span>

	<div class="flex-1" />
	<div
		class="w-full bg-zinc-800 border border-x-0 border-b-0 border-zinc-700 flex flex-col gap-2 py-2"
	>
		<button
			on:click={() => (createNewPageModalShowing = true)}
			class="bg-zinc-700 border-zinc-600 hover:bg-zinc-600 capitalize border hover:border-zinc-500 px-2 p-1 m-2 my-0 rounded-md"
			><i class="bi bi-file-earmark-plus" /> create template</button
		>
		<button
			on:click={() => (managingPages = !managingPages)}
			class={`${
				managingPages
					? 'bg-red-700 border-red-600 hover:bg-red-600 hover:border-red-500'
					: 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600 hover:border-zinc-500'
			}  capitalize border  px-2 p-1 m-2 my-0 rounded-md`}
			><i class="bi bi-gear" />
			{managingPages ? 'stop managing templates' : 'manage templates'}</button
		>
	</div>
</div>
