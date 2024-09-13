<script lang="ts">
	import type { MarketPlaceTilePage } from '$ts/common/types';
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { AddingPage, EditingPages } from '$ts/client/stores';
	import ProjectTypeButton from '~/routes/app/dashboard/projects/_components/CreateProjectModal/ProjectTypeButton.svelte';
	import ModalShell from './ModalShell.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_R2_URL } from '$env/static/public';
	import { cn } from '$ts/client/cn';

	export let projectId: string;

	let marketplacePages: MarketPlaceTilePage[] = [];

	onMount(async () => {
		const { pages } = await api.marketplace.listMarketplacePages();

		if (pages) {
			marketplacePages = pages;
		}
	});

	let pageName: string;
	let creatingPage = false;

	const createPage = async () => {
		if (creatingPage) return;
		creatingPage = true;
		await api.page.create({ projectId, name: pageName });
		await invalidateAll();
		creatingPage = false;

		$AddingPage = false;
		$EditingPages = true;
	};

	let step = 'type';
</script>

{#if $AddingPage}
	<ModalShell
		closeModal={() => {
			$AddingPage = false;
			step = 'type';
		}}
		title="Create Page"
	>
		{#if step === 'type'}
			<div class="grid grid-rows-2 gap-4">
				<ProjectTypeButton
					icon="plus-square-dotted"
					title="Blank"
					description="Start from scratch with an empty page"
					onClick={() => {
						step = 'blank';
					}}
				/>
				<ProjectTypeButton
					icon="tools"
					title="Toolbox"
					description="Explore pre-built pages and templates created by the community"
					onClick={() => {
						step = 'marketplace';
					}}
				/>
			</div>
		{/if}
		{#if step === 'blank'}
			<p class="mb-2">Page Name:</p>
			<input bind:value={pageName} type="text" />
			<button
				disabled={creatingPage}
				on:click={createPage}
				class="mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 text-blue-50">Submit</button
			>
		{/if}
		{#if step === 'marketplace'}
			{@const loading = false}
			<div class="grid h-[500px] grid-cols-1 gap-4 overflow-y-auto">
				{#each marketplacePages as page (page.id)}
					<div class="rounded-lg bg-zinc-800 p-4">
						<img
							src={PUBLIC_R2_URL + page.imageUrl}
							alt="thumbnail"
							class="mb-4 h-[200px] w-full rounded-md bg-zinc-700 object-contain p-4"
						/>
						<p class="text-2xl font-semibold">{page.name}</p>
						<p class="text-sm italic opacity-80">Created by {page.tilePage.user.name}</p>

						{#if page.description}
							<p class="mt-2 opacity-60">{page.description}</p>
						{/if}

						<div class="mt-4 flex items-center">
							<button
								on:click={() => {}}
								class={cn('flex-1 rounded-md bg-blue-500 p-2 px-4 font-semibold transition-all', {
									'pointer-events-none opacity-50': loading
								})}>{loading ? 'Creating Project...' : 'Use Template'}</button
							>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</ModalShell>

	<style lang="postcss">
		input {
			@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
		}
	</style>
{/if}
