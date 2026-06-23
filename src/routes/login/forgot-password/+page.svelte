<script lang="ts">
	import api from '$ts/client/api';

	let email = '';
	let submitting = false;
	let sent = false;
	let error = '';

	const submit = async () => {
		if (!email || submitting) return;
		submitting = true;
		error = '';

		const data = await api.auth.email.forgotPassword({ email });
		submitting = false;

		if (data?.success) {
			sent = true;
		} else {
			error = data?.error || 'Something went wrong. Please try again.';
		}
	};
</script>

<main class="grid h-screen place-items-center">
	<div class="flex w-full max-w-[800px] flex-col gap-16">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-zinc-900">Reset Password</h1>
		</div>
		<div class="flex flex-col border-y border-zinc-200 bg-zinc-50 p-4 sm:rounded-md sm:border">
			{#if sent}
				<p class="mb-2 text-zinc-700">
					If an account exists for <span class="font-semibold">{email}</span>, we've sent a password
					reset link. Check your inbox (and spam folder).
				</p>
				<p class="mb-4 text-sm text-zinc-500">The link expires in 1 hour.</p>
				<a
					href="/login/email"
					class="rounded-md bg-blue-600 p-2 text-center text-lg font-bold text-blue-50"
				>
					Back to login
				</a>
			{:else}
				<p class="mb-4 text-zinc-600">
					Enter your email and we'll send you a link to reset your password.
				</p>
				<input
					class="mb-4 rounded-md border border-zinc-300 p-4 text-zinc-800"
					type="text"
					placeholder="Email"
					bind:value={email}
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
					{submitting ? 'Sending...' : 'Send reset link'}
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
