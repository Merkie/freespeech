<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	let verifyEmailPressed = false;

	const { form, enhance, errors, constraints, message } = superForm(data.form);

	const sendVerificationEmail = async () => {
		const response = await fetch('/api/mail/send/verification');
		const data = await response.json();
		if (!data.success) {
			alert('Failed to send verification email');
		} else {
			verifyEmailPressed = true;
		}
	};
</script>

<svelte:head>
	<title>Verify Your Email | FreeSpeech AAC</title>
</svelte:head>

<main class="h-[100dvh] flex flex-col items-center justify-center">
	<h1 class="text-2xl font-medium mb-4">Verify {data.user?.email}</h1>
	{#if !verifyEmailPressed}
		<button
			on:click={sendVerificationEmail}
			class="bg-blue-600 border border-blue-500 rounded-md px-4 p-2 text-blue-50"
			><i class="bi bi-envelope" /> Request Verification Email</button
		>
	{:else}
		<form method="POST" use:enhance class="flex flex-col items-center gap-2">
			<p>Please enter the 6 digit code sent to your inbox:</p>
			<input
				type="text"
				placeholder="000000"
				name="token"
				class="border border-zinc-300 rounded-md p-2 w-full text-center"
				bind:value={$form.token}
				{...$constraints.token}
			/>
			<button
				type="submit"
				class="bg-blue-600 border border-blue-500 w-full rounded-md px-4 p-2 text-blue-50"
				>Submit</button
			>
			{#if $message}
				<p class="text-red-500 text-sm">{$message}</p>
			{/if}
		</form>
	{/if}
</main>
