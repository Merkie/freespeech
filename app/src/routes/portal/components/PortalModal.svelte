<script lang="ts">
	import isEmail from '$lib/client/isEmail';
	import trpc from '$lib/client/trpc';

	// Props
	export let is_login: boolean;
	export let authenticate: Function;

	// Bindings
	let name = '';
	let email = '';
	let passwordElement: HTMLInputElement;
	let emailElement: HTMLInputElement;

	// Booleans
	let is_password_visible = false;
	let is_email_valid = false;
	let is_email_taken = false;

	$: {
		// Email validation, first we check if there is an email
		if (email) {
			// Then we check if it's a valid email
			is_email_valid = isEmail(email);
			// If it is a valid, then we check if it's taken
			if (is_email_valid) {
				trpc(fetch)
					.query('user:validate_email', email)
					.then((res) => {
						is_email_taken = res;
					});
			}
		}
		if (isEmail(email + '')) {
			is_email_valid = true;
		} else {
			is_email_valid = false;
		}
	}
</script>

<div>
	<label for="email">Email address</label>
	<input type="text" on:change={() => email = emailElement.value} bind:this={emailElement} name="email" />
	{#if email && !is_email_valid}
		<p class="error">Invalid email address</p>
	{/if}
	{#if email && is_email_taken && is_email_valid && !is_login}
		<p class="error">Email is already in use</p>
	{/if}
	{#if !is_login}
		<label for="name">Your name</label>
		<input type="text" bind:value={name} name="name" />
	{/if}
	<label for="password"
		><span>Password</span><i
			class={`bx bxs-${is_password_visible ? 'show' : 'hide'}`}
			on:click={() => (is_password_visible = !is_password_visible)}
			on:keypress={() => null}
		/></label
	>
	<input
		bind:this={passwordElement}
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				if (is_email_valid) authenticate(emailElement.value, passwordElement.value, name);
			}
		}}
		type={is_password_visible ? 'text' : 'password'}
		name="password"
	/>
	{#if is_login}
		<a href="/forgotpassword">Forgot your password?</a>
	{/if}
	<button
		on:click={() => {
			if (is_email_valid) authenticate(emailElement.value, passwordElement.value, name);
		}}>{is_login ? 'Sign in' : 'Create account'}</button
	>
</div>

<style>
	div {
		display: inherit;
		flex-direction: inherit;
		background: var(--base-100);
		border: 1px solid var(--base-300);
		filter: var(--shadow);
		border-radius: 10px;
		padding: 40px;
		width: 400px;
	}

	label {
		margin-bottom: 5px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	i {
		font-size: 20px;
		cursor: pointer;
	}

	.error {
		margin-bottom: 20px;
		color: var(--danger-400);
	}

	input {
		margin-bottom: 20px;
	}

	a {
		margin-bottom: 20px;
		text-align: right;
	}

	@media (max-width: 750px) {
		div {
			width: calc(100% - 42px);
			border-radius: 0;
			padding: 20px;
		}
	}
</style>
