<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';
	import trpc from '$lib/client/trpc';
	import showdown from 'showdown';
	import docs from '$lib/client/docs';

	let page_content = '';
	let active_page = 'whatisaac';

	const converter = new showdown.Converter();

	const refresh_page = async () => {
		//@ts-ignore
		page_content = converter.makeHtml(docs[active_page]);
	};

	(async () => {
		await refresh_page();
	})();

	$: {
		if (active_page) {
			refresh_page();
		}
	}
</script>

<svelte:head>
	<title>Docs - FreeSpeech AAC</title>
</svelte:head>

<Header uri="dashboard" button_text="Dashboard" />
<main>
	<div class="sidebar">
		<b>Introduction</b>
		<a on:click={() => (active_page = 'whatisaac')} href="#what-is-aac">What is AAC?</a>
		<a on:click={() => (active_page = 'whyusefreespeech')} href="#why-use-freespeech"
			>Why use FreeSpeech AAC?</a
		>
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
	<div class="page-content" bind:innerHTML={page_content} contenteditable="false" />
</main>

<style>
	:global(body) {
		background: white;
	}
	main {
		color: black;
		margin-top: 56px;
		display: flex;
	}
	.sidebar {
		width: 250px;
		height: calc(100vh - 95px);
		background: var(--primary-300);
		color: white;
		position: fixed;
		/* top: 55px; */
		padding: 20px;
		left: 0;
		z-index: 100;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		font-size: 20px;
		scrollbar-width: thin;
	}

	.page-content {
		margin-left: 320px;
		margin-top: 20px;
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
