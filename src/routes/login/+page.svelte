<script lang="ts">
	let email: string;
	let password: string;

	const submitRegistration = async () => {
		const response = await fetch('/api/user/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		const json = await response.json();

		if (json.error) {
			return alert(json.error);
		}

		if (json.success) return window.location.assign('/');
	};
</script>

<main class="min-h-screen grid place-items-center">
	<div class="w-[90%] max-w-[500px] flex flex-col gap-2">
		<p class="text-xl mb-2">Sign in to FreeSpeech AAC</p>
		<input type="text" placeholder="Email" bind:value={email} />
		<input type="password" placeholder="Password" bind:value={password} />
		<button on:click={submitRegistration} class="p-2 rounded-md bg-blue-500 text-blue-50"
			>Submit</button
		>
		<a class="text-sm text-blue-500 underline mt-2" href="/register">Don't have an account yet?</a>
	</div>
</main>

<style lang="postcss">
	input {
		@apply p-2 rounded-md border border-zinc-300;
	}
</style>
