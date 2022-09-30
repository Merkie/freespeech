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

<input type="text" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={handle_user_creation}>Create User</button>
