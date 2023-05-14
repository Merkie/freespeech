<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let verifyEmailPressed = false;
	let token = '';

	const verifyEmail = async () => {
		verifyEmailPressed = true;
		const response = await fetch('/api/mail/send', {
			method: 'POST'
		});
		const data = await response.json();
		if (!data.success) {
			verifyEmailPressed = false;
			alert('Failed to send email');
		}
	};

	const submitToken = async () => {
		const response = await fetch('/api/mail/verify', {
			method: 'POST',
			body: JSON.stringify({
				token
			})
		});
		const data = await response.json();
		if (!data.success) {
			alert('Failed to verify email');
		} else {
			data.user.emailVerified = true;
		}
		verifyEmailPressed = false;
	};
</script>

<div class="flex flex-col gap-2 p-4">
	<h1 class="text-xl flex items-center gap-2">
		{data.user?.email}
		{#if !data.user?.emailVerified}
			<button class="p-1 px-2 text-sm bg-blue-500 text-white rounded-md" on:click={verifyEmail}
				>Verify Email</button
			>
		{:else}
			<span class="p-1 px-2 text-sm bg-green-500 text-white rounded-md">Verified</span>
		{/if}
	</h1>
	{#if verifyEmailPressed}
		<p>Please enter the code sent to your email:</p>
		<div class="flex items-center gap-2">
			<input
				bind:value={token}
				placeholder="000000"
				type="text"
				class="rounded-md w-fit text-zinc-900 p-1 px-2"
			/>
			<button
				class="p-1 px-2 text-sm bg-blue-500 text-white rounded-md w-fit"
				on:click={submitToken}>Submit</button
			>
		</div>
	{/if}
</div>
