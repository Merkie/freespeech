<script lang="ts">
	import Application from '$components/app/Application.svelte';
	import type { PageData } from './$types';
	import { ActivePage, ActiveProject } from '$ts/client/stores';
	export let data: PageData;

	$ActiveProject = data.project;
	$ActivePage = data.page;
</script>

<Application />
