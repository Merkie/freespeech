<script lang="ts">
	import ModalShell from '$components/modals/ModalShell.svelte';
	import api from '$ts/client/api';

	export let isOpen: boolean;
	export let closeModal: () => void;
	export let email: string;
	export let hasPassword: boolean;
	export let onDeleted: () => Promise<void>;

	let confirmation = '';
	let error = '';
	let deleting = false;

	$: canSubmit = hasPassword
		? confirmation.length > 0
		: confirmation.trim().toLowerCase() === email.toLowerCase();

	const close = () => {
		if (deleting) return;
		confirmation = '';
		error = '';
		closeModal();
	};

	const deleteAccount = async () => {
		if (!canSubmit || deleting) return;
		deleting = true;
		error = '';

		try {
			const response = await api.user.deleteAccount(
				hasPassword ? { password: confirmation } : { email: confirmation }
			);

			if (response.success) {
				await onDeleted();
				return;
			}

			error = response.error || 'Your account could not be deleted. Please try again.';
		} catch {
			error = 'Your account could not be deleted. Check your connection and try again.';
		}

		deleting = false;
	};
</script>

{#if isOpen}
	<ModalShell closeModal={close} title="Delete account">
		<form on:submit|preventDefault={deleteAccount} class="flex flex-col gap-4">
			<p class="text-zinc-300">
				This permanently deletes your account, all of your boards, and the images you uploaded. It
				cannot be undone. Download your data first if you want a copy.
			</p>

			{#if hasPassword}
				<label class="flex flex-col gap-2 text-sm text-zinc-400">
					Enter your password to confirm
					<input
						bind:value={confirmation}
						type="password"
						autocomplete="current-password"
						class="rounded-md border border-zinc-700 bg-zinc-800 p-2 px-4 text-base text-zinc-100"
					/>
				</label>
			{:else}
				<label class="flex flex-col gap-2 text-sm text-zinc-400">
					<span>Type <span class="font-semibold text-zinc-200">{email}</span> to confirm</span>
					<input
						bind:value={confirmation}
						type="email"
						autocomplete="off"
						class="rounded-md border border-zinc-700 bg-zinc-800 p-2 px-4 text-base text-zinc-100"
					/>
				</label>
			{/if}

			{#if error}
				<p class="text-sm text-red-400">{error}</p>
			{/if}

			<div class="flex justify-end gap-2">
				<button
					type="button"
					on:click={close}
					disabled={deleting}
					class="rounded-md border border-zinc-700 p-2 px-4 text-zinc-300 disabled:opacity-50"
					>Cancel</button
				>
				<button
					type="submit"
					disabled={!canSubmit || deleting}
					class="rounded-md border border-red-500 bg-red-600 p-2 px-4 text-red-50 disabled:opacity-50"
					>{deleting ? 'Deleting…' : 'Delete my account'}</button
				>
			</div>
		</form>
	</ModalShell>
{/if}
