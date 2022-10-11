<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';

	// trpc
	import trpc from '$lib/client/trpc';
</script>

<Header uri="app" button_text="Application" />
<main>
	<h1>Welcome to FreeSpeech</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</main>

<style>
	main {
		margin-top: 50px;
		padding: 20px;
	}
</style>
