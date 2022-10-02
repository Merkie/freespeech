<script lang="ts">
	import { handleSilentRefresh } from 'lucia-sveltekit/client';
	export let data;
	
	handleSilentRefresh();

	let theme = `
		--surface-1: #1c2127;
		--surface-2: #252a31;
		--surface-3: #2f343c;
		--surface-4: #383e47;
		--surface-5: #404854;
		--background: #111418;
		--text: white;

		--success: #32a467;
		--primary: #2d72d2;
		--failure: #d23f31;`;

		if(data.theme) {
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

	/* Colors */
	:global(body) {
		/* --surface-1: #1c2127;
		--surface-2: #252a31;
		--surface-3: #2f343c;
		--surface-4: #383e47;
		--surface-5: #404854;
		--background: #111418;
		--text: white;

		--success: #32a467;
		--primary: #2d72d2; */
		
	}

	/* Global styles */
	:global(*) {
		margin: 0;
		transition-duration: 0.1s;
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
