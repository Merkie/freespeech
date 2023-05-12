<script lang="ts">
	import BottomNavigation from '$components/common/BottomNavigation.svelte';
	import Loader from '$components/common/Loader.svelte';
	import { ActiveProject, Loading } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { fly, scale } from 'svelte/transition';
	export let data: LayoutData;

	onMount(() => {
		// If the active project is from another user, reset it
		if ($ActiveProject) {
			if ($ActiveProject.userId !== data.user?.id) {
				$ActiveProject = null;
			}
		}
	});
</script>

{#if $Loading}
	<Loader />
{/if}

<main class="h-screen flex flex-col">
	<div class="flex-1 relative overflow-auto">
		<div class="absolute w-full max-h-full min-h-full top-0 left-0 flex flex-col">
			<slot><!-- optional fallback --></slot>
		</div>
	</div>
	<BottomNavigation noProjects={false} />
</main>
