<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';

	// trpc
	import trpc from '$lib/client/trpc';

	export let data;

	const make_project = async () => {
		const response = await trpc(fetch).mutation(`project:create`, {
			name: 'test',
			description: 'test',
			index: 0
		});
	};
</script>

<Header uri="app" button_text="Application" />
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={make_project}>Make project</button>
