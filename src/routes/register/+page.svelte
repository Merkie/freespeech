<script lang="ts">
	let email = '';
	let name = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	const submitRegistration = async () => {
		const registrationResponse = await fetch('/api/v1/user/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				name,
				password,
				confirmPassword
			})
		});

		const registrationResponseJson = await registrationResponse.json();

		if (registrationResponseJson.error) {
			error = registrationResponseJson.error;
		} else {
			window.location.assign('/app/dashboard/projects');
		}
	};
</script>

<main class="grid min-h-screen place-items-center">
	<div class="flex w-[90%] max-w-[500px] flex-col gap-2">
		<p class="mb-2 text-xl">Register for FreeSpeech AAC</p>
		<input class="input-light" type="text" placeholder="Email" bind:value={email} />
		<input class="input-light" type="text" placeholder="Name" bind:value={name} />
		<input
			class="input-light"
			type="password"
			placeholder="Password (Must be at least 8 characters)"
			bind:value={password}
		/>
		<input
			class="input-light"
			type="password"
			placeholder="Confirm Password"
			bind:value={confirmPassword}
		/>
		{#if error}
			<small class="text-red-500">{error}</small>
		{/if}
		<button on:click={submitRegistration} class="rounded-md bg-blue-500 p-2 text-blue-50"
			>Submit</button
		>
		<a class="mt-2 text-sm text-blue-500 underline" href="/login">Already have an account?</a>
	</div>
</main>
