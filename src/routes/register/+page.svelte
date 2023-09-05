<script lang="ts">
	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	const submitRegistration = async () => {
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		const response = await fetch('/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				name,
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
			<h1 class="text-4xl font-bold text-blue-600 sm:text-5xl">
				FreeSpeech <span class="font-light">AAC</span>
			</h1>
			<p class="text-xl sm:text-2xl">Free and open-source AAC for everyone.</p>
		</div>
		<div
			class="flex flex-col gap-4 border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border"
		>
			<input
				class="rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="text"
				placeholder="Name"
				bind:value={name}
			/>
			<input
				class="rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="text"
				placeholder="Email"
				bind:value={email}
			/>
			<input
				class="rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="password"
				placeholder="Password (Must be at least 8 characters)"
				bind:value={password}
			/>
			<input
				class="rounded-md border border-zinc-300 p-4 text-zinc-800"
				type="password"
				placeholder="Confirm Password"
				bind:value={confirmPassword}
			/>
			{#if error}
				<small class="text-red-500">{error}</small>
			{/if}
			<button
				on:click={submitRegistration}
				class="rounded-md bg-blue-600 p-2 text-lg font-bold text-blue-50">Create Account</button
			>
			<a class="text-sm text-blue-600 underline" href="/login">Already have an account?</a>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
