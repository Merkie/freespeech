<script lang="ts">
	let email = '';
	let password = '';
	let error = '';

	const submitLogin = async () => {
		const response = await fetch('/api/v1/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});

		const data = await response.json();

		if (data.error) {
			error = data.error;
		} else {
			window.location.assign('/app/dashboard/projects');
		}
	};
</script>

<main class="grid h-screen place-items-center">
	<div class="flex w-full max-w-[800px] flex-col gap-16">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-zinc-900">Login To Free Speech</h1>
		</div>
		<div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
			<input
				class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="text"
				placeholder="Email"
				bind:value={email}
			/>
			<input
				class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="password"
				placeholder="Password (Must be at least 8 characters)"
				bind:value={password}
			/>
			{#if error}
				<small class="mb-4 text-red-500">{error}</small>
			{/if}
			<button
				on:click={submitLogin}
				class="rounded-md bg-blue-600 p-2 text-lg font-bold text-blue-50">Log In</button
			>
			<a href="/register" class="mt-4 p-4 text-zinc-400">
				<span class="mr-4">{`Don't have an account?`}</span>
				<i class="bi bi-arrow-right"></i>
			</a>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
