<script lang="ts">
	// Stores
	import {
		InEditMode,
		CurrentPageId,
		InSettingsPage,
		AppProject,
		EditorTool,
		EditorTools,
		Me,
		CloneModalProject,
		GuidedAccessPin,
		SwappedTile,
		PageHistory,
		PageHistoryIndex,
		EditedTiles
	} from '$lib/client/stores';

	// Trpc
	import trpc from '$lib/client/trpc';

	// Components
	import Spinner from '$lib/client/components/Spinner.svelte';
	import GuidedAccessModal from './GuidedAccessModal.svelte';

	// State
	let edit_unlocked = false;
	let is_ga_keypad_open = false;
	let saving = false;

	// Resets the state of the app back to the home page
	// triggers when clicking the home page
	const reset_state = () => {
		$InEditMode = false;
		$CurrentPageId = $AppProject.pages[0].id;
		$InSettingsPage = false;
		edit_unlocked = false;
		is_ga_keypad_open = false;
		const home_page_id = $AppProject.pages.find((page) => page.name.toLowerCase() === 'home')?.id;
		$PageHistory = [home_page_id];
		$PageHistoryIndex = 0;
	};

	// Handle's toggling the edit button
	const handle_edit_toggle = async () => {
		if ($GuidedAccessPin.length > 1 && !edit_unlocked) {
			is_ga_keypad_open = true;
			return;
		}
		if ($AppProject.userId != $Me.id) {
			$CloneModalProject = $AppProject;
			return;
		}
		$SwappedTile = null;
		$InEditMode = !$InEditMode;
		if (!$InEditMode) {
			window.getSelection()?.removeAllRanges();
			$EditorTool = EditorTools.text;
			$CloneModalProject = null;
			if ($EditedTiles.length > 0) {
				await update_tiles();
			}
		}
	};

	// Handles clicking the settings button in the app navigation
	const handle_settings_click = () => {
		if ($GuidedAccessPin.length > 1 && !edit_unlocked) {
			is_ga_keypad_open = true;
			return;
		}
		$InSettingsPage = true;
		$InEditMode = false;
	};

	// Updates all the tiles on the server
	const update_tiles = async () => {
		const all_tiles = $AppProject.pages.flatMap((page) => page.tiles);
		const edited_tiles = $EditedTiles.map((id) => all_tiles.find((tile) => tile.id == id));
		saving = true;
		await trpc(fetch).mutation('tile:edit_many', edited_tiles);
		saving = false;
		$EditedTiles = [];
	};

	$: {
		if (edit_unlocked) {
			is_ga_keypad_open = false;
		}
	}
</script>

{#if is_ga_keypad_open}
	<GuidedAccessModal
		close_modal={() => (is_ga_keypad_open = false)}
		callback={(value) => (edit_unlocked = value)}
	/>
{/if}

<section style={`border-color: ${$InEditMode ? 'transparent' : 'auto'};`}>
	<button on:click={reset_state}><i class="bx bxs-home-alt-2" /> <span>Home</span></button>
	<button
		disabled={$InSettingsPage}
		class={`${$InEditMode ? 'selected-edit' : 'edit'}`}
		on:click={handle_edit_toggle}
		style={`opacity: ${$AppProject.userId != $Me.id ? '0.5' : '1'};
						opacity: ${$GuidedAccessPin.length > 1 && edit_unlocked == false ? '0.5' : 'auto'};`}
		><i class={$InEditMode ? 'bx bx-check' : 'bx bxs-pencil'} />
		<span>{$InEditMode ? 'Save Changes' : 'Edit'}</span>
	</button>
	<button
		class={`${$InSettingsPage ? 'selected' : ''}`}
		style={`opacity: ${$GuidedAccessPin.length > 1 && edit_unlocked == false ? '0.5' : '1'};`}
		on:click={handle_settings_click}><i class="bx bxs-cog" /> <span>Settings</span></button
	>
</section>

{#if saving}
	<Spinner />
{/if}

<style>
	section {
		width: auto;
		position: fixed;
		bottom: 0;
		width: calc(100% - 20px);
		background: var(--base-100);
		border-top: 1px solid var(--base-400);
		padding: 10px;
		display: flex;
		gap: 10px;
		z-index: 9;
	}
	button {
		flex: 1;
		background: var(--base-200);
		border-color: var(--base-400);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 20px;
	}

	button:active {
		background: var(--primary-300);
		border-color: var(--primary-400);
	}
	.selected {
		background: var(--primary-300);
		border-color: var(--primary-400);
	}
	.selected-edit {
		background: var(--success-300) !important;
		border-color: var(--success-400) !important;
	}
	.edit:active {
		background: var(--base-200) !important;
		border-color: var(--base-400) !important;
	}

	@media (max-width: 750px) {
		button span {
			display: none;
		}
		section {
			padding-bottom: 50px;
		}
		button {
			font-size: 30px;
		}
	}
</style>
