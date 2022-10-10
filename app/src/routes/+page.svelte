<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';

	// trpc
	import trpc from '$lib/client/trpc';

	export let data;
</script>

<Header uri="app" button_text="Application" />
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={make_project}>Make project</button>
