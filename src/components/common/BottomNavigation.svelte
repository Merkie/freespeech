<script lang="ts">
	import {
		DiscardUnsavedChangesHandler,
		EditingTiles,
		LocalSettings,
		TileBeingEdited,
		UnsavedChanges,
		UnsavedChangesModalOpen,
		UsingOnlineSearch
	} from '$ts/client/stores';
	import { page } from '$app/stores';
	import { cn } from '$ts/client/cn';
</script>

<div
	class="flex gap-2 border border-x-0 border-b-0 border-zinc-700 bg-zinc-900 p-2 text-[25px] font-light text-zinc-100"
>
	<!-- Home button -->
	<a
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
		class={cn('flex-1 rounded-md p-1 text-center transition-colors', {
			'bg-zinc-800': !$page.url.pathname.startsWith('/app/dashboard') && !$EditingTiles
		})}
		href={`/app/project/${$LocalSettings.lastVisitedProjectId}`}
	>
		<i class="bi bi-house-fill"></i>
	</a>

	<!-- Edit Button -->
	<button
		on:click={() => {
			$EditingTiles = true;
		}}
		class={cn('flex-1 rounded-md p-1 text-center transition-colors', {
			'bg-zinc-800': !$page.url.pathname.startsWith('/app/dashboard') && $EditingTiles
		})}
		disabled={$page.url.pathname.startsWith('/app/dashboard')}
		><i class="bi bi-pencil-fill"></i></button
	>

	<!-- Dashboard Button -->
	<a
		href="/app/dashboard/projects"
		class={cn('flex-1 rounded-md p-1 text-center transition-colors', {
			'bg-zinc-800': $page.url.pathname.startsWith('/app/dashboard'),
			'pointer-events-none opacity-50': $EditingTiles
		})}><i class="bi bi-gear-fill"></i></a
	>
</div>
