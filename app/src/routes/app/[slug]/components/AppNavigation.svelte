<script lang="ts">
	import { InEditMode, CurrentPageId, InSettingsPage, AppProject } from '$lib/client/stores';
	const reset_state = () => {
		$InEditMode = false;
		$CurrentPageId = $AppProject.pages[0].id;
		$InSettingsPage = false;
	};
</script>

<section style={`border-color: ${$InEditMode ? 'transparent' : 'auto'};`}>
	<button on:click={reset_state}><i class="bx bxs-home-alt-2" /> Home</button>
	<button
		disabled={$InSettingsPage}
		class={`${$InEditMode ? 'selected-edit' : 'edit'}`}
		on:click={() => ($InEditMode = !$InEditMode)}
		><i class={$InEditMode ? 'bx bx-check' : 'bx bxs-pencil'} />
		{$InEditMode ? 'Save Changes' : 'Edit'}</button
	>
	<button
		class={`${$InSettingsPage ? 'selected' : ''}`}
		on:click={() => {
			$InSettingsPage = true;
			$InEditMode = false;
		}}><i class="bx bxs-cog" /> Settings</button
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
</style>
