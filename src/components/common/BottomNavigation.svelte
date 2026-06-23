<script lang="ts">
	import {
		DiscardUnsavedChangesHandler,
		EditingTiles,
		LocalSettings,
		PinEntryModalOpen,
		PinPromptText,
		PinUnlockHandler,
		TileBeingEdited,
		UnsavedChanges,
		UnsavedChangesModalOpen,
		UsingOnlineSearch
	} from '$ts/client/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { cn } from '$ts/client/cn';
	import PinEntryModal from '$components/modals/PinEntryModal.svelte';

	// Open the PIN gate with a specific unlock action + prompt.
	function requirePin(prompt: string, onUnlock: () => void) {
		$PinPromptText = prompt;
		$PinUnlockHandler = onUnlock;
		$PinEntryModalOpen = true;
	}

	// Entering edit mode: gate behind the PIN modal if the access control is on,
	// otherwise enter directly. (Exiting edit mode never requires the PIN.)
	function requestEditMode() {
		if ($LocalSettings.editPinEnabled) {
			requirePin('Enter your PIN to enter edit mode.', () => ($EditingTiles = true));
		} else {
			$EditingTiles = true;
		}
	}

	// Leaving the board for the dashboard: gate behind the PIN when on a board view
	// (already inside the dashboard, or no PIN set, navigates directly).
	function requestDashboard() {
		const inDashboard = $page.url.pathname.startsWith('/app/dashboard');
		if (!inDashboard && $LocalSettings.editPinEnabled) {
			requirePin('Enter your PIN to open the dashboard.', () => goto('/app/dashboard/projects'));
		} else {
			goto('/app/dashboard/projects');
		}
	}

	$: homeHref =
		$LocalSettings.lastVisitedProjectId && $LocalSettings.lastVisitedHomePageId
			? `/app/project/${$LocalSettings.lastVisitedProjectId}/${$LocalSettings.lastVisitedHomePageId}`
			: $LocalSettings.lastVisitedProjectId
				? `/app/project/${$LocalSettings.lastVisitedProjectId}`
				: '/app/dashboard/projects';
</script>

<div
	data-sveltekit-preload-data
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
		href={homeHref}
	>
		<i class="bi bi-house-fill"></i>
	</a>

	<!-- Edit Button -->
	<button
		on:click={() => {
			if ($EditingTiles) {
				if (!$UnsavedChanges) {
					$EditingTiles = false;
					$UsingOnlineSearch = false;
					$TileBeingEdited = null;
				} else {
					$DiscardUnsavedChangesHandler = () => {
						$EditingTiles = false;
						$UsingOnlineSearch = false;
						$TileBeingEdited = null;
						$UnsavedChanges = false;
					};
					$UnsavedChangesModalOpen = true;
				}
			} else {
				requestEditMode();
			}
		}}
		class={cn('flex-1 rounded-md p-1 text-center transition-colors', {
			'bg-zinc-800': !$page.url.pathname.startsWith('/app/dashboard') && $EditingTiles
		})}
		disabled={$page.url.pathname.startsWith('/app/dashboard')}
		><i class="bi bi-pencil-fill"></i></button
	>

	<!-- Dashboard Button -->
	<button
		on:click={requestDashboard}
		disabled={$EditingTiles}
		class={cn('flex-1 rounded-md p-1 text-center transition-colors', {
			'bg-zinc-800': $page.url.pathname.startsWith('/app/dashboard'),
			'pointer-events-none opacity-50': $EditingTiles
		})}><i class="bi bi-gear-fill"></i></button
	>
</div>

<PinEntryModal />
