<script lang="ts">
	import BottomNavigation from '$components/common/BottomNavigation.svelte';
	import Loader from '$components/common/Loader.svelte';
	import { Loading } from '$ts/client/stores';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	onMount(() => {
		const tokenCookie = document.cookie
			.split(';')
			.find((c) => c.trim().startsWith('token='))
			?.split('=')[1];
		window.localStorage.setItem('token', tokenCookie || '');
	});
</script>

{#if $Loading}
	<Loader />
{/if}

<main class="flex h-[100dvh] flex-col">
	<div class="relative flex-1 overflow-auto">
		<div class="absolute left-0 top-0 flex max-h-full min-h-full w-full flex-col">
			{#if children}{@render children()}{:else}<!-- optional fallback -->{/if}
		</div>
	</div>
	{#if !data.noUI}
		<BottomNavigation />
	{/if}
</main>
