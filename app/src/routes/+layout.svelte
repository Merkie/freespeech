<script>
	// import { Boundary } from '@crownframework/svelte-error-boundary';
	import './app.css';
	import { Me } from '$lib/client/stores';

	// import Boundary from '$lib/client/components/Boundary.svelte';
	import Boundary from '$lib/client/ErrorBoundary';

	export let data;

	$Me = data.user;
</script>

<Boundary>
	<slot />
</Boundary>
