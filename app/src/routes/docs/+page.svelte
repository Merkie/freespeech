<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';
</script>

<svelte:head>
	<title>Docs - FreeSpeech AAC</title>
</svelte:head>

<Header uri="dashboard" button_text="Dashboard" />
<main>
	<div class="sidebar">
		<b>Introduction</b>
		<a href="#">What is AAC?</a>
		<a href="#">Why use FreeSpeech AAC?</a>
		<a href="#">Getting started</a>
		<a href="#">Using the app</a>
		<b>Editor</b>
		<a href="#">Basics</a>
		<a href="#">Tools</a>
		<a href="#">Adding pages and working with folders</a>
		<a href="#">Locking the editor (guided access)</a>
		<a href="#">Troubleshooting</a>
		<b>Public Projects</b>
		<a href="#">What are public projects?</a>
		<a href="#">Creating a public project</a>
		<a href="#">Using public projects within an organization</a>
		<a href="#">Linking public projects as navigations</a>
		<b>Organizations</b>
		<a href="#">What are organizations?</a>
		<a href="#">Creating an organization</a>
		<a href="#">Managing an organization</a>
		<a href="#">Using organizations</a>
		<b>Customization</b>
		<a href="#">Using the application settings menu</a>
		<a href="#">Custom editor colors</a>
		<a href="#">Custom CSS</a>
		<a href="#">Using theme and settings files</a>
		<a href="#">Using AI synthesized voices</a>
	</div>
</main>

<style>
	:global(body) {
		background: white;
	}
	main {
		color: black;
		margin-top: 58px;
	}
	.sidebar {
		width: 250px;
		height: calc(100vh - 95px);
		background: var(--primary-300);
		color: white;
		position: fixed;
		top: 55px;
		padding: 20px;
		left: 0;
		z-index: 100;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		font-size: 20px;
	}
	.sidebar a {
		color: white;
		text-decoration: none;
		margin-top: 10px;
	}
	.sidebar a:hover {
		text-decoration: underline;
	}
	.sidebar b {
		margin-top: 20px;
	}
</style>
