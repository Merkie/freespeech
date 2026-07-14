<script lang="ts">
	import type { TilePage } from '$ts/common/types';
	import { clickOutside } from '$ts/client/click-outside';
	import { cn } from '$ts/client/cn';
	import {
		AddingPage,
		EditingPages,
		EditingTiles,
		NetworkOnline,
		OfflineCacheStatus,
		requestBoardRefresh
	} from '$ts/client/stores';
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { tick } from 'svelte';

	export let page: TilePage;
	export let isHomePage = false;

	let element: HTMLElement;

	let x = 0;
	let y = 0;

	$: {
		if (element) {
			const rect = element.getBoundingClientRect();
			x = rect.left;
			y = rect.top + rect.height;
		}
	}

	let isDropDownOpen = false;

	// Inline rename of the page name (only available in edit mode, never for the home page).
	let renaming = false;
	let draftName = '';
	let renameInput: HTMLInputElement;
	let savingName = false;

	$: canRename = $EditingTiles && !isHomePage;
	$: offlineIcon = !$NetworkOnline
		? 'wifi-off'
		: $OfflineCacheStatus.phase === 'preparing'
			? 'arrow-repeat'
			: $OfflineCacheStatus.phase === 'ready'
				? 'cloud-check-fill'
				: $OfflineCacheStatus.phase === 'partial' || $OfflineCacheStatus.phase === 'error'
					? 'exclamation-triangle-fill'
					: 'cloud-arrow-down';
	$: offlineStatusClass = !$NetworkOnline
		? 'border-amber-500/50 bg-amber-500/15 text-amber-100'
		: $OfflineCacheStatus.phase === 'ready'
			? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100'
			: $OfflineCacheStatus.phase === 'partial' || $OfflineCacheStatus.phase === 'error'
				? 'border-amber-500/50 bg-amber-500/15 text-amber-100'
				: 'border-zinc-600 bg-zinc-800 text-zinc-200';

	const startRename = async () => {
		if (!canRename || renaming) return;
		draftName = page.name;
		renaming = true;
		await tick();
		renameInput?.focus();
		renameInput?.select();
	};

	const cancelRename = () => {
		renaming = false;
	};

	const commitRename = async () => {
		if (!renaming) return;
		renaming = false;

		const name = draftName.trim();
		if (!name || name === page.name) return;

		savingName = true;
		const response = await api.page.edit(page.id, { name });
		savingName = false;

		if (response.error) return alert(response.error);

		await invalidateAll();
		requestBoardRefresh();
	};
</script>

<div class="relative h-14 bg-zinc-900 p-2 font-light text-zinc-100">
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
		{#if renaming}
			<input
				bind:this={renameInput}
				bind:value={draftName}
				on:blur={commitRename}
				on:keydown={(e) => {
					if (e.key === 'Enter') commitRename();
					else if (e.key === 'Escape') cancelRename();
				}}
				class="rounded-md border border-zinc-600 bg-zinc-800 px-2 py-0.5 text-center text-zinc-100 outline-none focus:border-blue-500"
			/>
		{:else if canRename}
			<button
				on:click={startRename}
				disabled={savingName}
				title="Rename page"
				class="flex items-center gap-2 rounded-md px-2 py-0.5 transition-all hover:bg-zinc-800"
			>
				<span>{page.name}</span>
				<i class="bi bi-pencil text-xs text-zinc-400"></i>
			</button>
		{:else}
			<p>{page.name}</p>
		{/if}
	</div>

	{#if $EditingTiles}
		<div class="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
			<button
				bind:this={element}
				on:click={() => (isDropDownOpen = true)}
				class=" flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-1 px-4"
			>
				<i class="bi bi-grid-fill"></i>
				<span>Page Actions</span>
			</button>
		</div>
	{/if}

	<div
		class={`absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${offlineStatusClass}`}
		title={$OfflineCacheStatus.detail || $OfflineCacheStatus.message}
	>
		<i
			class={`bi bi-${offlineIcon} ${$OfflineCacheStatus.phase === 'preparing' ? 'animate-spin' : ''}`}
		></i>
		<span class="hidden sm:inline">{$OfflineCacheStatus.message}</span>
	</div>
</div>

<div
	use:clickOutside
	on:clickOutside={() => {
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
		on:click={() => {
			isDropDownOpen = false;
			$AddingPage = true;
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
		><i class="bi bi-plus-lg text-sm"></i><span>Add New Page</span></button
	>
	<div class="h-[1px] w-full bg-zinc-700/[40%]"></div>
	<button
		on:click={() => {
			isDropDownOpen = false;
			$EditingPages = true;
		}}
		class="flex items-center gap-2 rounded-md p-2 px-4 text-left transition-all hover:bg-zinc-700/[50%]"
	>
		<i class="bi bi-grid text-sm"></i><span>View All Pages</span>
	</button>
</div>
