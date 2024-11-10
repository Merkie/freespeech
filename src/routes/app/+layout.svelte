<script lang="ts">
	import BottomNavigation from '$components/common/BottomNavigation.svelte';
	import Loader from '$components/common/Loader.svelte';
	import { Loading } from '$ts/client/stores';
	import { onMount } from 'svelte';

	export let data;

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

<main class="grid h-[100dvh] grid-cols-1 grid-rows-[60px_1fr_60px]">
	<slot><!-- optional fallback --></slot>
	{#if !data.noUI}
		<BottomNavigation />
	{/if}
</main>
