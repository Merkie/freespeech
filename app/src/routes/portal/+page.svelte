<script lang="ts">
	import trpc from '$lib/client/trpc';
	import PortalModal from './components/PortalModal.svelte';
	import { page } from '$app/stores';

	let is_login = $page.url.searchParams.get('login') === 'true';

	const authenticate = async (email: string, password: string, name: string | null) => {
		// 1) Call a tRPC mutation request to login
		const validate_response = await trpc(fetch).mutation(
			`auth:${is_login ? 'login' : 'create_account'}`,
			{
				email,
				password,
				name
			}
		);
		if (!validate_response) return alert('Invalid credentials');

		// 2) If successful, save the token to cookies
		// 1 week expiration
		document.cookie = 'freespeech-token=' + validate_response + ';max-age=' + 60 * 60 * 24 * 7;

		// 3) Redirect to the dashboard
		window.location.href = '/dashboard';
	};
</script>

<svelte:head>
	<title>Portal - FreeSpeech</title>
</svelte:head>

<main>
	<h1 class="brand">
		<img src="/images/icons/icon-120.png" width="30px" height="30px" alt="logo" />FreeSpeech AAC
	</h1>
	<h1>{is_login ? 'Sign in to your account' : 'Create an account'}</h1>
	<p class="subtext">
		Or <span class="link" on:keypress={() => null} on:click={() => (is_login = !is_login)}
			>{!is_login ? 'Sign in to your account' : 'Create an account'}</span
		>
	</p>
	<PortalModal {...{ is_login, authenticate }} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 20px;
		margin-bottom: 20px;
		font-weight: 500;
	}

	.subtext {
		margin-bottom: 20px;
	}

	.link {
		color: var(--primary-400);
		cursor: pointer;
	}
</style>
