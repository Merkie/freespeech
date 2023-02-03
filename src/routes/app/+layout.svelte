<script>
	import { onMount } from 'svelte';
	import AppModeSwitcher from './components/AppModeSwitcher.svelte';
	import { CurrentUser } from '$lib/stores';
	import DebugBar from './components/DebugBar.svelte';

	let authenticated = false;

	onMount(async () => {
		if ($CurrentUser) {
			//  console.log('authenticated from cache');
			authenticated = true;
		}
		const response = await fetch('/api/v1/user/me').then((res) => res.json());
		//  console.log(response);
		if (!response._id) {
			window.location.href = '/login';
			return;
		}
		delete response.success;
		//  console.log('updated user cache from server');
		$CurrentUser = response;
		authenticated = true;
	});
</script>

<main class="w-screen min-h-screen h-full bg-zinc-200 flex flex-col justify-end">
	{#if authenticated}
		<slot />
		<DebugBar />
		<AppModeSwitcher />
	{/if}
</main>
