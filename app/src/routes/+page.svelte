<script lang="ts">
	// components
	import Header from '$lib/client/components/Header.svelte';
</script>

<svelte:head>
	<title>FreeSpeech AAC</title>
</svelte:head>

<Header uri="dashboard" button_text="Dashboard" />
<main>
	<div class="hero-img-container">
		<img src="/images/hero.png" class="hero-img" alt="hero" />
	</div>

	<div class="site-content-wrapper" style="background: white;">
		<div class="site-content">
			<div class="centered">
				<img
					class="app-icon"
					alt="Unbranded computer and tablet showcasing FreeSpeech AAC."
					src="/images/icons/icon-512.png"
				/>
				<button><i class="bx bx-download" /> Download</button>
			</div>
			<div class="text">
				<h1>Lorem Ispum Dolor</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fugiat sed nisi? Nemo
					beatae incidunt cumque eaque nesciunt pariatur officia, ab vel repudiandae, praesentium
					nostrum ut eveniet fuga quam recusandae.
				</p>
			</div>
		</div>
	</div>

	<div class="site-content-wrapper">
		<div class="site-content reverse">
			<div>
				<img
					alt="Unbranded computer and tablet showcasing FreeSpeech AAC."
					src="/images/computer-tablet.png"
				/>
			</div>
			<div class="text">
				<h1>Lorem Ispum Dolor</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fugiat sed nisi? Nemo
					beatae incidunt cumque eaque nesciunt pariatur officia, ab vel repudiandae, praesentium
					nostrum ut eveniet fuga quam recusandae.
				</p>
			</div>
		</div>
	</div>

	<div class="site-content-wrapper" style="background: white;">
		<div class="site-content">
			<div>
				<img alt="Screenshot of the application's editor." src="/images/editor.png" />
			</div>
			<div class="text">
				<h1>Lorem Ispum Dolor</h1>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fugiat sed nisi? Nemo
					beatae incidunt cumque eaque nesciunt pariatur officia, ab vel repudiandae, praesentium
					nostrum ut eveniet fuga quam recusandae.
				</p>
			</div>
		</div>
	</div>
	<div class="footer">
		<span>
			<div class="footer-category">
				<b>Account</b>
				<a href="/portal?login=false">Create Account</a>
				<a href="/portal?login=true">Sign in</a>
			</div>
			<div class="footer-category">
				<b>Dashboard</b>
				<a href="/dashboard/account">Account</a>
				<a href="/dashboard/projects">Projects</a>
				<a href="/dashboard/explore">Explore</a>
			</div>
		</span>
		<p>FreeSpeech AAC v0.5 - 2022</p>
		<a
			style="color: white; margin-top: 5px;"
			href="https://github.com/Merkie/freespeech/blob/master/LICENSE.md"
			>Provided under the MIT license</a
		>
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
	.site-content {
		display: flex;
		gap: 80px;
		width: min(90%, 1200px);
		margin: 0 auto;
	}

	.site-content-wrapper {
		padding: 40px 0;
		background-color: #f6f7f9;
	}
	.site-content div {
		flex: 1;
		display: flex;
	}

	.centered {
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 20px;
	}

	.centered button {
		font-size: 25px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.site-content img {
		width: 100%;
	}
	.site-content .text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
	}
	.hero-img {
		width: 100%;
		height: 300px;
		object-fit: cover;
		opacity: 0.8;
	}
	.hero-img-container {
		background-color: var(--primary-300);
		height: 300px;
		position: relative;
	}

	.reverse {
		flex-direction: row-reverse;
	}

	.app-icon {
		width: 200px !important;
		height: 200px !important;
		filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.25));
	}

	.footer {
		background-color: var(--primary-300);
		color: white;
		padding: 20px 0;
		text-align: center;
	}

	.footer span {
		display: flex;
		align-items: baseline;
		justify-content: center;
	}

	.footer-category {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		gap: 5px;
		padding: 20px;
	}

	.footer-category a {
		color: white;
	}

	@media (max-width: 750px) {
		.site-content {
			flex-direction: column;
			gap: 20px;
		}
	}
</style>
