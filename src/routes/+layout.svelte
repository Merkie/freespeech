<script>
	import { setContext } from 'svelte';
	import '../app.postcss';
	import Modaler from '$components/modals/Modaler.svelte';

	export let data;

	setContext('media_uri', data.media_uri);
</script>

<slot />
<Modaler />

<style lang="postcss">
	:global(body) {
		@apply font-sans;
	}
</style>
