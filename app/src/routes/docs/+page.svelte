<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';
	import trpc from '$lib/client/trpc';
	import showdown from 'showdown';
	import docs from '$lib/client/docs';

	let page_content = '';
	let active_page = 'whatisaac';
	let is_sidebar_open = false;

	const converter = new showdown.Converter({
		emoji: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true
	});
	

	const refresh_page = async () => {
		//@ts-ignore
		console.log(docs[active_page]);
		console.log(converter.makeHtml(docs[active_page]));
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

<Header uri="dashboard" button_text="Dashboard" site_header={true} />
<main class={`${is_sidebar_open ? 'open' : ''}`}>
	<div class={`sidebar`}>
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
	<div on:keypress={() => {}} on:click={() => is_sidebar_open = false} class="page-content" bind:innerHTML={page_content} contenteditable="false" />
</main>

<button on:click={() => is_sidebar_open = true} style={`opacity: ${is_sidebar_open ? '0' : '.75'}; left: ${is_sidebar_open ? '-75px' : '0px'};`} class="docs-toggle-btn">
	<i class='bx bx-chevrons-right'></i>
</button>

<style>
	:global(body) {
		background: white !important;
		overflow-y: hidden;
	}
	main {
		position: absolute;
		width: 100%;
		left: 0px;
		color: black;
		margin-top: 56px;
		display: flex;
	}

	.open {
		width: 100%;
		left: 0px;
	}
	.sidebar {
		width: 250px;
		height: calc(100vh - 95px);
		background: var(--primary-300);
		color: white;
		/* position: fixed; */
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
		height: calc(100vh - 95px);
		padding: 20px;
		overflow: auto;
		scrollbar-width: thin;
		flex: 1;
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

	.docs-toggle-btn {
		position: fixed;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		padding: 10px;
		border-radius: 0 10px 10px 0;
		font-size: 30px;
		opacity: .75;
	}

	@media (max-width: 750px) {
		main {
			width: calc(100% + 290px);
			left: -290px;
		}
	}
</style>
