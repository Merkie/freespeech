<script>
	import { setContext } from 'svelte';
	import '../app.postcss';

	export let data;

	setContext('media_uri', data.media_uri);
</script>

<slot />

<style lang="postcss">
	:global(body) {
		@apply font-sans;
	}
</style>
