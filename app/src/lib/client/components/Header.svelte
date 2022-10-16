<script lang="ts">
	export let uri: string;
	export let button_text: string;
	export let site_header: boolean = false;
	import { Me } from '$lib/client/stores';

	let is_dropdown_open = false;
</script>

<section class={`${site_header ? 'site-header' : ''}`}>
	<h1 on:click={() => window.location.assign('/')}>
		<img src={'/images/logo-white.png'} alt="logo" /> FreeSpeech
	</h1>
	<span class="links">
		<a href="/about">About</a>
		<a href="/docs">Documentation</a>
	</span>
	<span style="flex: 1;" />
	{#if $Me}
		<button class="dt-btn" on:click={() => window.location.assign('/' + uri)}
			>{button_text}<i class="bx bx-right-arrow-alt" /></button
		>
	{:else}
		<span class="btn-group dt-btn">
			<button on:click={() => window.location.assign('/portal?login=true')}>Login</button>
			<button on:click={() => window.location.assign('/portal?login=false')}>Create Account</button>
		</span>
	{/if}
	<div class="mobile-menu" on:click={() => (is_dropdown_open = !is_dropdown_open)}>
		<i class="bx bx-menu" />
	</div>
</section>
<div style={`display: ${is_dropdown_open ? 'flex' : 'none'};`} class="mobile-dropdown">
	<a href="/about">About</a>
	<a href="/docs">Documentation</a>
	{#if $Me}
		<button on:click={() => window.location.assign('/' + uri)}
			>{button_text}<i class="bx bx-right-arrow-alt" /></button
		>
	{:else}
		<span class="btn-group">
			<button on:click={() => window.location.assign('/portal?login=true')}>Login</button>
			<button on:click={() => window.location.assign('/portal?login=false')}>Create Account</button>
		</span>
	{/if}
</div>

<style>
	section {
		padding: 10px 20px;
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%);
		border-bottom: 1px solid var(--primary-400);
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		width: calc(100% - 40px);
		z-index: 999999;
	}

	.site-header {
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%) !important;
		border-bottom: 1px solid var(--primary-400) !important;
	}

	.links {
		display: flex;
		gap: 20px;
		margin-left: 20px;
	}

	.links a {
		color: white;
		text-decoration: none;
		font-size: 17px;
		opacity: 0.75;
	}

	.links a:hover {
		opacity: 1;
	}

	img {
		height: 35px;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 500;
		cursor: pointer;
	}

	button {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.btn-group {
		display: flex;
		gap: 10px;
	}

	.mobile-menu {
		font-size: 30px;
		display: none;
		cursor: pointer;
	}

	.mobile-dropdown {
		position: fixed;
		top: 53px;
		width: 100vw;
		z-index: 999;
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%);
		display: none;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
	}

	.mobile-dropdown a {
		color: white;
		text-decoration: none;
		font-size: 17px;
	}

	.mobile-dropdown button {
		width: calc(100% - 60px);
	}

	.mobile-dropdown .btn-group {
		width: calc(100% - 60px);
	}

	@media (max-width: 750px) {
		h1 {
			font-size: 20px;
		}

		button {
			font-size: 16px;
		}

		section {
			padding: 10px 20px;
			width: calc(100% - 40px);
			background: var(--background);
			border: none;
		}

		.mobile-dropdown {
			background: var(--background);
			box-shadow: 0 0 0 9999px rgba(0, 0, 0, .75);
		}

		img {
			height: 30px;
		}

		.links a {
			display: none;
		}

		.mobile-menu {
			display: block;
		}

		.dt-btn {
			display: none;
		}
		.mobile-dropdown {
			display: flex;
		}
	}
</style>
