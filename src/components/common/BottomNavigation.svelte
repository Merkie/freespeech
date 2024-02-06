<script lang="ts">
	import {
		EditingTiles,
		LocalSettings,
		TileBeingEdited,
		UnsavedChanges,
		UsingOnlineSearch,
		DiscardUnsavedChangesHandler,
		UnsavedChangesModalOpen
	} from '$ts/client/stores';
	import { page } from '$app/stores';
</script>

<!-- TODO: This wont display in new versions of safari -->
<div
	class="flex gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] font-light text-zinc-100"
>
	<!-- Home button -->
	<a
		class={`${
			$page.url.pathname.startsWith('/app/') && !$page.url.pathname.startsWith('/app/dashboard')
				? 'bg-zinc-800'
				: ''
		} ${!$LocalSettings.lastVisitedProjectId ? 'pointer-events-none opacity-50' : ''}`}
		href={$LocalSettings.lastVisitedProjectId
			? `/app/project/${$LocalSettings.lastVisitedProjectId}`
			: ''}
	>
		<i class="bi bi-house-fill"></i>
	</a>

	<!-- Edit Button -->
	{#if $EditingTiles}
		<!-- Editing State -->
		<button
			on:click={() => {
				if (!$UnsavedChanges) {
					$EditingTiles = false;
					$UsingOnlineSearch = false;
					$TileBeingEdited = null;
					$UnsavedChanges = false;
				} else {
					$DiscardUnsavedChangesHandler = () => {
						$EditingTiles = false;
						$UsingOnlineSearch = false;
						$TileBeingEdited = null;
						$UnsavedChanges = false;
					};
					$UnsavedChangesModalOpen = true;
				}
			}}
			disabled={$page.url.pathname.startsWith('/app/dashboard')}
			class="flex items-center justify-center gap-4 border border-blue-500 bg-blue-600 text-lg"
		>
			<i class="bi bi-check-lg"></i><span>Finish Editing</span></button
		>
	{:else}
		<!-- Normal State -->
		<button
			on:click={() => {
				$EditingTiles = true;
			}}
			disabled={$page.url.pathname.startsWith('/app/dashboard')}
			><i class="bi bi-pencil-fill"></i></button
		>
	{/if}

	<!-- Dashboard Button -->
	<a
		href="/app/dashboard/projects"
		class={`${$page.url.pathname.startsWith('/app/dashboard') ? 'bg-zinc-800' : ''} ${
			$EditingTiles ? 'pointer-events-none opacity-50' : ''
		}`}><i class="bi bi-gear-fill"></i></a
	>
</div>

<style lang="postcss">
	button,
	a {
		@apply flex-1 rounded-md p-1 text-center transition-colors;
	}
</style>
