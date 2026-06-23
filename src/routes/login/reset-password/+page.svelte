<script lang="ts">
	import { page } from '$app/stores';
	import api from '$ts/client/api';

	$: token = $page.url.searchParams.get('token') || '';

	let password = '';
	let confirm = '';
	let submitting = false;
	let done = false;
	let error = '';

	const submit = async () => {
		if (submitting) return;
		error = '';

		if (!token) {
			error = 'This reset link is invalid or has expired.';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}
		if (password !== confirm) {
			error = "Passwords don't match.";
			return;
		}

		submitting = true;
		const data = await api.auth.email.resetPassword({ token, password });
		submitting = false;

		if (data?.success) {
			done = true;
		} else {
			error = data?.error || 'Something went wrong. Please try again.';
		}
	};
</script>

<main class="grid h-screen place-items-center">
	<div class="flex w-full max-w-[800px] flex-col gap-16">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-zinc-900">Set a New Password</h1>
		</div>
		<div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
			{#if done}
				<p class="mb-4 text-zinc-700">
					Your password has been reset. You can now log in with your new password.
				</p>
				<a
					href="/login/email"
					class="rounded-md bg-blue-600 p-2 text-center text-lg font-bold text-blue-50"
				>
					Go to login
				</a>
			{:else if !token}
				<p class="mb-4 text-red-500">
					This reset link is missing or invalid. Please request a new one.
				</p>
				<a
					href="/login/forgot-password"
					class="rounded-md bg-blue-600 p-2 text-center text-lg font-bold text-blue-50"
				>
					Request a new link
				</a>
			{:else}
				<input
					class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
					type="password"
					placeholder="New password (at least 8 characters)"
					bind:value={password}
				/>
				<input
					class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
					type="password"
					placeholder="Confirm new password"
					bind:value={confirm}
					on:keydown={(e) => e.key === 'Enter' && submit()}
				/>
				{#if error}
					<small class="mb-4 text-red-500">{error}</small>
				{/if}
				<button
					on:click={submit}
					disabled={submitting}
					class="rounded-md bg-blue-600 p-2 text-lg font-bold text-blue-50 disabled:opacity-50"
				>
					{submitting ? 'Resetting...' : 'Reset password'}
				</button>
				<a href="/login/email" class="mt-4 p-4 text-center text-zinc-400">
					<i class="bi bi-arrow-left"></i>
					<span class="ml-2">Back to login</span>
				</a>
			{/if}
		</div>
	</div>
</main>

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
