<script lang="ts">
	import { signOut } from 'lucia-sveltekit/client';

	export let data: { _lucia: any };
	let authenticated = false;

	if (data['_lucia']) authenticated = true;
</script>

<h1>Home</h1>
{#if authenticated}
	<p>Logged in as: {data['_lucia'].user.email}</p>
	<a href="/settings">settings</a>
	<button on:click={async () => signOut('/')}>Sign out</button>
{/if}

<a href="/signup">signup</a>
<a href="/login">login</a>
