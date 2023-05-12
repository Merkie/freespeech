<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	export let data: PageData;
	const { form, enhance, errors, constraints, message } = superForm(data.form);
</script>

<main class="min-h-screen grid place-items-center">
	<div class="w-[90%] max-w-[500px] flex flex-col gap-2">
		<p class="text-xl mb-2">Sign in to FreeSpeech AAC</p>
		<form use:enhance method="POST" class="flex flex-col gap-2">
			<input
				type="text"
				placeholder="Email"
				name="email"
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<small class="text-red-500">{$errors.email}</small>{/if}
			<input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={$form.password}
				{...$constraints.password}
			/>
			{#if $errors.password}<small class="text-red-500">{$errors.password}</small>{/if}
			{#if $message}<small class="text-red-500">{$message}</small>{/if}
			<button type="submit" class="p-2 rounded-md bg-blue-500 text-blue-50">Submit</button>
		</form>
		<a class="text-sm text-blue-500 underline mt-2" href="/register">Don't have an account yet?</a>
	</div>
</main>

<style lang="postcss">
	input {
		@apply p-2 rounded-md border border-zinc-300;
	}
</style>
