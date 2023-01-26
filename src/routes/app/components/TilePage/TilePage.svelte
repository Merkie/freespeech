<script lang="ts">
	import { CurrentUser, CurrentProject, AppMode, SelectedEditModeTool } from '$lib/stores';
	import { onMount } from 'svelte';
	import TilePageHeader from './TilePageHeader.svelte';
	import TilePageSentenceBuilder from './SentenceBuilder.svelte';
	import TilePageTilePad from './TilePad.svelte';
	import WelcomeModal from './WelcomeModal.svelte';

	import Toolbar from '../Edit/Toolbar.svelte';
	import EditModeHeader from '../Edit/EditModeHeader.svelte';
	import PagePicker from '../Edit/PagePicker.svelte';

	let welcomeModalClosed = false;

	onMount(() => {
		if (!$CurrentProject?.isPublic && $CurrentProject?.userId !== $CurrentUser?.id) {
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
			<TilePageSentenceBuilder />
			<TilePageHeader />
			<TilePageTilePad />
		</main>
		{#if $AppMode === 'edit' && $SelectedEditModeTool === 'navigation'}
			<PagePicker />
		{/if}
	</div>
</div>
