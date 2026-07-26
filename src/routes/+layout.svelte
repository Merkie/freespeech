<script>
	import { setContext } from 'svelte';
	import '../app.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';

	export let data;

	setContext('media_uri', data.media_uri);
</script>

<slot />

<style lang="postcss">
	:global(body) {
		@apply font-sans;
	}
</style>
