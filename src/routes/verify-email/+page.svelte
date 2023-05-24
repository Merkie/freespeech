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

<main class="flex h-[100dvh] flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-medium">Verify {data.user?.email}</h1>
	{#if !verifyEmailPressed}
		<button
			on:click={sendVerificationEmail}
			class="rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-blue-50"
			><i class="bi bi-envelope" /> Request Verification Email</button
		>
	{:else}
		<form method="POST" use:enhance class="flex flex-col items-center gap-2">
			<p>Please enter the 6 digit code sent to your inbox:</p>
			<input
				type="text"
				placeholder="000000"
				name="token"
				class="w-full rounded-md border border-zinc-300 p-2 text-center"
				bind:value={$form.token}
				{...$constraints.token}
			/>
			<button
				type="submit"
				class="w-full rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-blue-50"
				>Submit</button
			>
			{#if $message}
				<p class="text-sm text-red-500">{$message}</p>
			{/if}
		</form>
	{/if}
	<a href="/app/dashboard/projects" class="mt-4 text-blue-500 underline">Verify email later</a>
</main>
