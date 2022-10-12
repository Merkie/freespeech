<script lang="ts">
	export let uri: string;
	export let button_text: string;
	import { Me } from '$lib/client/stores';
</script>

<section>
	<h1 on:click={() => window.location.assign('/')}>
		<img src={'/images/logo-white.png'} alt="logo" /> FreeSpeech
	</h1>
	{#if $Me}
		<button on:click={() => window.location.assign('/' + uri)}
			>{button_text}<i class="bx bx-right-arrow-alt" /></button
		>
	{:else}
		<span class="btn-group">
			<button on:click={() => window.location.assign('/portal')}>Login</button>
			<button on:click={() => window.location.assign('/portal')}>Create Account</button>
		</span>
	{/if}
</section>

<style>
	section {
		padding: 10px 20px;
		background: linear-gradient(90deg, var(--primary-300) 0%, var(--primary-200) 100%);
		border-bottom: 1px solid var(--primary-400);
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: 0;
		width: calc(100% - 40px);
		z-index: 999;
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
		}

		img {
			height: 30px;
		}
	}
</style>
