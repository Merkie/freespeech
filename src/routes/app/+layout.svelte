<script lang="ts">
	import BottomNavigation from '$components/common/BottomNavigation.svelte';
	import Loader from '$components/common/Loader.svelte';
	import { Loading } from '$ts/client/stores';

	export let data;
</script>

{#if $Loading}
	<Loader />
{/if}

<main class="flex h-[100dvh] flex-col">
	<div class="relative flex-1 overflow-auto">
		<div class="absolute left-0 top-0 flex max-h-full min-h-full w-full flex-col">
			<slot><!-- optional fallback --></slot>
		</div>
	</div>
	<BottomNavigation noProjects={false} projectId={data.projectId + ''} />
</main>
