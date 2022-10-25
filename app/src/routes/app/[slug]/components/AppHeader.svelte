<script lang="ts">
	import { AppHeaderBehavior } from '$lib/client/stores';
</script>

<nav style={`
		display: ${$AppHeaderBehavior === 'always showing' ? 'flex' : 'auto'};
	`}>
	<img height="20px" src="/images/logo-white.png" alt="FreeSpeech AAC Logo" />
	<p>Layout:</p>
	<select>
		<option value="English Layout">English Layout</option>
		<option value="Another Layout">Another Layout</option>
	</select>
	<p>Vocabulary:</p>
	<select>
		<option value="English Layout">All</option>
		<option value="Another Layout">1A</option>
		<option value="Another Layout">2A</option>
		<option value="Another Layout">3A</option>
	</select>
</nav>

<style>
	nav {
		display: flex;
		background: var(--background);
		padding: 10px;
		gap: 5px;
		align-items: center;
	}
	select {
		padding: 2px;
	}
	img,
	select {
		margin-right: 10px;
	}

	@media (max-width: 750px) {
		nav {
			display: none;
		}
	}
</style>
