<script lang="ts">
	import { handleSilentRefresh } from 'lucia-sveltekit/client';
	import { DarkTheme, LightTheme } from '$lib/theme';
	export let data;
	
	handleSilentRefresh();

	let theme = LightTheme;

	if(data.theme) {
		// add the custom theme to the theme object
		theme = theme + data.theme.split(';').map((line: string) => { return '--'+line.trim()+';' }).join(' ');
	}
</script>

<main style={theme}>
	<slot />
</main>

<style>
	/* Main styles */
	main {
		position: relative;
		height: 100vh;
		width: 100vw;
		
		color: var(--text);
		background-color: var(--background);
		font-family: 'Inter', sans-serif;
	}

	/* Global styles */
	:global(*) {
		margin: 0;
		transition-duration: 0.1s;
		scrollbar-width: none;
	}

	/* Button styles */
	:global(button) {
		cursor: pointer;
	}

	:global(button:hover) {
		filter: brightness(1.1);
		border: 1px solid var(--surface-5);
	}

	:global(button:active) {
		transform: scale(0.99);

	}
</style>
