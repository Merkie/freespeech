<script lang="ts">
	import { create_user } from '$lib/api/user';
	let email: string = '';
	let password: string = '';

	const handle_user_creation = async () => {
		const response = await create_user(email, password);
		if (response.message === 'ok') {
			window.location.assign('/');
		}
	};
</script>

<div>
	<h1>Signup</h1>
	<input type="text" placeholder="email" bind:value={email} />
	<input type="password" placeholder="password" bind:value={password} />
	<button on:click={handle_user_creation}>Create User</button>
	<a href="/login">Need to login?</a>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		background-color: var(--surface-1);
		border-radius: 5px;
		border: 1px solid var(--surface-4);
		width: fit-content;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 50px;
	}

	input, button {
		color: var(--text) !important;
		width: 100%;
		max-width: 300px;
		height: 50px;
		border: 1px solid var(--surface-4);
		background-color: var(--background);
		border-radius: 5px;
		padding: 10px;
		font-size: 16px;
	}

	a {
		color: var(--text) !important;
	}

	button:hover {
		background-color: var(--primary);
	}
</style>
