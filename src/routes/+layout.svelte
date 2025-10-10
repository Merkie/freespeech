<script lang="ts">
	import { setContext } from 'svelte';
	import '../app.css';

	let { data, children } = $props();

	setContext('media_uri', data.media_uri);
</script>

{@render children?.()}

<style lang="postcss">
	:global(body) {
		@apply font-sans;
	}
</style>
