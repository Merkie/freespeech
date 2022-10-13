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
		CloneModalProject
	} from '$lib/client/stores';

	// Resets the state of the app back to the home page
	const reset_state = () => {
		$InEditMode = false;
		$CurrentPageId = $AppProject.pages[0].id;
		$InSettingsPage = false;
	};

	const handle_edit_toggle = () => {
		if($AppProject.userId != $Me.id) {
			$CloneModalProject = $AppProject;
			return;
		}
		$InEditMode = !$InEditMode;
		if (!$InEditMode) {
			$EditorTool = EditorTools.text;
			$CloneModalProject = null;
		};
	}
</script>

<section style={`border-color: ${$InEditMode ? 'transparent' : 'auto'};`}>
	<button on:click={reset_state}><i class="bx bxs-home-alt-2" /> <span>Home</span></button>
	<button
		disabled={$InSettingsPage}
		class={`${$InEditMode ? 'selected-edit' : 'edit'}`}
		on:click={handle_edit_toggle}
		style={`opacity: ${$AppProject.userId != $Me.id ? '0.5' : '1'};`}
		><i class={$InEditMode ? 'bx bx-check' : 'bx bxs-pencil'} />
		<span>{$InEditMode ? 'Save Changes' : 'Edit'}</span>
	</button>
	<button
		class={`${$InSettingsPage ? 'selected' : ''}`}
		on:click={() => {
			$InSettingsPage = true;
			$InEditMode = false;
		}}><i class="bx bxs-cog" /> <span>Settings</span></button
	>
</section>

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
	}
</style>
