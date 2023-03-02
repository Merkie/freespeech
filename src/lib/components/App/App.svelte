<script lang="ts">
	import { CurrentUser, CurrentProject, AppMode, SelectedEditModeTool } from '$lib/stores';
	import { onMount } from 'svelte';

	// App Components
	import TileGridHeader from './TileGrid/TileGridHeader.svelte';
	import SentenceBuilder from './SentenceBuilder.svelte';
	import TileGrid from './TileGrid/TileGrid.svelte';
	import WelcomeModal from './WelcomeModal.svelte';

	// Edit Mode Components
	import Toolbar from './Edit/Toolbar.svelte';
	import EditModeHeader from './Edit/EditModeHeader.svelte';
	import PagePicker from './Edit/PagePicker.svelte';
	import TemplatePicker from './Edit/TemplatePicker.svelte';

	let welcomeModalClosed = false;

	onMount(async () => {
		if ($CurrentProject?.private && $CurrentProject?.userid !== $CurrentUser?._id) {
			$CurrentProject = null;
		}
	});
</script>

{#if !welcomeModalClosed && !$CurrentProject}
	<WelcomeModal
		callback={() => {
			welcomeModalClosed = true;
		}}
	/>
{/if}

<div class="flex flex-1 flex-col">
	{#if $AppMode === 'edit'}
		<EditModeHeader />
	{/if}
	<div class="flex flex-1">
		{#if $AppMode === 'edit'}
			<Toolbar />
		{/if}
		<main class="flex-1 bg-zinc-200 flex flex-col">
			<SentenceBuilder />
			<TileGridHeader />
			<TileGrid />
		</main>
		{#if $AppMode === 'edit' && $SelectedEditModeTool === 'navigation'}
			<PagePicker />
		{/if}
		{#if $AppMode === 'edit' && $SelectedEditModeTool === 'template'}
			<TemplatePicker />
		{/if}
	</div>
</div>
