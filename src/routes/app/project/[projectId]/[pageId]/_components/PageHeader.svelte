<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { TilePage } from '$ts/common/types';
	import { clickOutside } from '$ts/client/click-outside';
	import { cn } from '$ts/client/cn';
	import { AddingPage, EditingPages, EditingTiles, PageBeingEdited } from '$ts/client/stores';

	interface Props {
		page: TilePage;
	}

	let { page }: Props = $props();

	let element: HTMLElement = $state();

	let x = $state(0);
	let y = $state(0);

	run(() => {
		if (element) {
			const rect = element.getBoundingClientRect();
			x = rect.left;
			y = rect.top + rect.height;
		}
	});

	let isDropDownOpen = $state(false);
</script>

<div class="relative h-14 bg-zinc-900 p-2 font-light text-zinc-100">
	<p class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{page.name}</p>

	{#if $EditingTiles}
		<div class="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
			<button
				bind:this={element}
				onclick={() => (isDropDownOpen = true)}
				class=" flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-1 px-4"
			>
				<i class="bi bi-grid-fill"></i>
				<span>Page Actions</span>
			</button>
		</div>
	{/if}
</div>

<div
	use:clickOutside
	onclickOutside={() => {
		isDropDownOpen = false;
	}}
	style={`top: ${y}px; left: ${x}px;`}
	class={cn(
		`fixed left-0 z-10 flex h-fit w-fit translate-y-[20px] flex-col whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800 p-2 text-white transition-all`,
		{
			'pointer-events-none translate-y-[10px] select-none opacity-0 ': !isDropDownOpen
		}
	)}
>
	<button
		onclick={() => {
			isDropDownOpen = false;
			$PageBeingEdited = { ...page };
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
	>
		<i class="bi bi-pencil text-sm"></i><span>Edit "{page.name}"</span>
	</button>
	<div class="h-[1px] w-full bg-zinc-700/[40%]"></div>
	<button
		onclick={() => {
			isDropDownOpen = false;
			$AddingPage = true;
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
		><i class="bi bi-plus-lg text-sm"></i><span>Add New Page</span></button
	>
	<div class="h-[1px] w-full bg-zinc-700/[40%]"></div>
	<button
		onclick={() => {
			isDropDownOpen = false;
			$EditingPages = true;
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
	>
		<i class="bi bi-grid text-sm"></i><span>View All Pages</span>
	</button>
	<div class="h-[1px] w-full bg-zinc-700/[40%]"></div>
	<!-- <button
		on:click={() => {
			isDropDownOpen = false;
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
	>
		<i class="bi bi-cloud-upload text-sm"></i><span>Upload "{page.name}" to Marketplace</span>
	</button> -->
</div>
