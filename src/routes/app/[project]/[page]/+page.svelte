<script lang="ts">
	import Application from '$components/app/Application.svelte';
	import type { PageData } from './$types';
	import { ActivePage, ActiveProject, isEditing } from '$ts/client/stores';
	export let data: PageData;

	$ActiveProject = data.project;
	$ActivePage = data.page;
</script>

<svelte:head>
	<title
		>{$isEditing ? 'Editing: ' : ''}{$ActivePage} - {$ActiveProject?.name} | FreeSpeech AAC</title
	>
</svelte:head>
<Application />
