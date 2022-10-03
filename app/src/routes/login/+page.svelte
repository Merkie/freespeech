<script lang="ts">
	import { login } from '$lib/api/user';
	let email: string = '';
	let password: string = '';

	const handleLogin = async () => {
		const response = await login(email, password);
		if (response.message === 'ok') {
			window.location.assign('/');
		}
	};
</script>

<input type="text" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={handleLogin}>Login User</button>
