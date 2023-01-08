<script lang="ts">
	import { onMount } from 'svelte';
	import generateRandomUsername from '$lib/helpers/randomUsername';
	// import '$lib/helpers/cloudflareTurnstyle';

	export let isLogin: Boolean;
	// export let captcha: { image: string; hash: string };

	let email = '';
	let name = '';
	let password = '';
	let confirmPassword = '';
	let captchaValue = '';
	let rememberMe = false;
	let randomUsername = '';
	let form: HTMLFormElement;
	let captcha = { image: '', hash: '' };

	onMount(async () => {
		randomUsername = generateRandomUsername();
		captcha = await (await fetch('/api/v1/captcha/create')).json();
	});

	const handleSubmit = async () => {
		let response;

		if (isLogin) {
			response = await fetch('/api/v1/user/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					captcha: captchaValue,
					captchaHash: captcha.hash
				})
			});
		} else {
			response = await fetch('/api/v1/user/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					name: name || randomUsername,
					password,
					captcha: captchaValue,
					captchaHash: captcha.hash
				})
			});
		}

		const data = await response.json();

		if (!data.success) {
			alert(data.message);
			return;
		}

		// set cookie
		document.cookie = `token=${data.token}; path=/; max-age=${
			rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24
		}; SameSite=Strict; Secure;`;
		// redirect to home
		window.location.href = '/app';
	};
</script>

<main class="h-screen w-screen bg-zinc-200 grid place-items-center">
	<form
		bind:this={form}
		on:submit|preventDefault
		class="p-8 shadow-md w-full sm:max-w-[500px] sm:rounded-lg bg-zinc-100 border border-zinc-300 flex flex-col gap-2"
	>
		<h1 class="text-xl text-zinc-600 mb-2">
			{isLogin ? 'Login to FreeSpeech' : 'Create a FreeSpeech account'}
		</h1>
		<p class="text-sm">Email</p>
		<input
			bind:value={email}
			type="text"
			class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
			placeholder=""
		/>
		{#if !isLogin}
			<p class="text-sm">Name</p>
			<div class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2 flex">
				<input
					class="outline-none bg-transparent border-none flex-1 h-full"
					bind:value={name}
					type="text"
					placeholder={randomUsername}
				/>
				<button on:click={() => (randomUsername = generateRandomUsername())}>
					<i class="bi bi-dice-3" />
				</button>
			</div>
		{/if}

		<p class="text-sm">Password</p>
		<input
			bind:value={password}
			type="password"
			class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
			placeholder=""
		/>

		{#if !isLogin}
			<p class="text-sm">Confirm Password</p>
			<input
				bind:value={confirmPassword}
				type="password"
				class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
				placeholder=""
			/>
		{/if}

		<p class="text-sm">Captcha</p>
		<div class="flex gap-4 mb-2">
			<div class="flex-1 flex items-start">
				<img src={captcha.image} class="object-contain rounded-md border border-zinc-300" alt="" />
			</div>
			<div class="flex-1 grid items-center">
				<input
					bind:value={captchaValue}
					type="text"
					class="w-full bg-zinc-200 p-2 rounded-md border border-zinc-300 mb-2"
					placeholder=""
				/>
			</div>
		</div>

		<div
			class="cursor-pointer"
			on:click={(e) => {
				rememberMe = !rememberMe;
			}}
			on:keypress={(e) => {
				if (e.key === 'Enter') rememberMe = !rememberMe;
			}}
		>
			<input bind:checked={rememberMe} class="mr-4 cursor-pointer" type="checkbox" />
			<span class="text-sm select-none">Remember me</span>
		</div>

		<button on:click={handleSubmit} class="bg-blue-500 text-blue-50 p-2 rounded-md mt-2">
			Continue
		</button>

		<p class="mt-2 text-sm">
			{isLogin ? "Don't have an account? " : 'Already have an account? '}
			<a class="text-blue-400 underline" href={isLogin ? '/signup' : '/login'}>
				{isLogin ? 'Sign up' : 'Login'}
			</a>
		</p>
	</form>
</main>
