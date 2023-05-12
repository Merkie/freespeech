<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	export let data: PageData;
	const { form, enhance, errors, constraints, message } = superForm(data.form);
</script>

<main class="min-h-screen grid place-items-center">
	<div class="w-[90%] max-w-[500px] flex flex-col gap-2">
		<p class="text-xl mb-2">Register for FreeSpeech AAC</p>
		<form method="POST" use:enhance class="flex flex-col gap-2">
			<input
				type="text"
				placeholder="Email"
				name="email"
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}
				<small class="text-red-500">{$errors.email}</small>
			{/if}
			<input
				type="text"
				placeholder="Name"
				name="name"
				bind:value={$form.name}
				{...$constraints.name}
			/>
			{#if $errors.name}
				<small class="text-red-500">{$errors.name}</small>
			{/if}
			<input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={$form.password}
				{...$constraints.password}
			/>
			{#if $errors.password}
				<small class="text-red-500">{$errors.password}</small>
			{/if}
			<input
				type="password"
				placeholder="Confirm Password"
				name="confirmPassword"
				bind:value={$form.confirmPassword}
				{...$constraints.confirmPassword}
			/>
			{#if $errors.confirmPassword}
				<small class="text-red-500">{$errors.confirmPassword}</small>
			{/if}
			{#if $message}
				<small class="text-red-500">{$message}</small>
			{/if}
			<button type="submit" class="p-2 rounded-md bg-blue-500 text-blue-50">Submit</button>
		</form>
		<a class="text-sm text-blue-500 underline mt-2" href="/login">Already have an account?</a>
	</div>
</main>

<style lang="postcss">
	input {
		@apply p-2 rounded-md border border-zinc-300;
	}
</style>
