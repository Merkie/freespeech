<script lang="ts">
	import { page } from '$app/stores';
	import trpc from '$lib/client/trpc';

	export let error: string | null = null;
	export let onError: Function | null = null;

	let error_type: string;
	let app_project_id: string;

	if ($page.url.pathname.includes('/app/')) {
		error_type = 'app';
		app_project_id = $page.url.pathname.split('/').at(-1) + '';
	}

	let ENV = typeof process !== 'undefined' && process.env && process.env.NODE_ENV;
	let DEV = ENV !== 'PROD';

	if ($error) console.log($error);

	$: if ($error && onError) onError($error);
</script>

<svelte:head>
	{#if $error}
		<title>Error - FreeSpeech</title>
	{/if}
</svelte:head>

{#if $error}
	<main>
		<h1>Oops!</h1>
		{#if error_type === 'app'}
			<p>
				It looks like this project has been corrupted! If this was a mistake and you need your data
				restored, email archer@freespeechaac.com and include the project id <code
					>{app_project_id}</code
				>. Thank you for your patience and understanding.
			</p>
			<div class="btn-group">
				<button on:click={() => window.location.assign('/dashboard')}>Back to dashboard</button>
				<button
					on:click={async () => {
						await trpc(fetch).mutation('project:delete', app_project_id);
						window.location.assign('/dashboard');
					}}>Delete this project</button
				>
			</div>
		{:else}
			<p>
				Something went wrong. Please try again. If this keeps happening, please email
				archer@freespeechaac.com. Thank you for your patience and understanding.
			</p>
			<button on:click={() => window.location.assign('/dashboard')}>Back to dashboard</button>
		{/if}
	</main>
{:else}
	<slot />
{/if}

<style>
	main {
		position: absolute;
		top: 0;
		left: 0;
		background-color: var(--danger-300);
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		gap: 20px;
		text-align: center;
	}
	h1 {
		font-size: 2rem;
		margin: 0;
	}
	p {
		width: min(80%, 500px);
	}
	code {
		background-color: var(--danger-200);
		border: 1px solid var(--danger-400);
		padding: 0.2rem 0.4rem;
		border-radius: 0.2rem;
	}
	button {
		background-color: var(--danger-400);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
		cursor: pointer;
	}
	.btn-group {
		display: flex;
		gap: 10px;
	}
</style>
