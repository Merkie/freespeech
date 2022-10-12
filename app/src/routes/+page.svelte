<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';
</script>

<svelte:head>
	<title>FreeSpeech AAC</title>
</svelte:head>

<Header uri="dashboard" button_text="Dashboard" />
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
