<script lang="ts">
	// Stores
	import { AppHeaderBehavior, Me, AppProject, VocabularySetting } from '$lib/client/stores';

	// Bindings
	let project_select_element: HTMLSelectElement;
	let vocab_select_element: HTMLSelectElement;
</script>

<nav
	style={`
		display: ${$AppHeaderBehavior === 'always showing' ? 'flex' : 'auto'};
	`}
>
	<img height="20px" src="/images/logo-white.png" alt="FreeSpeech AAC Logo" />
	<p>Layout:</p>
	<select
		bind:this={project_select_element}
		on:change={() => window.location.assign('/app/' + project_select_element.value)}
		value={$AppProject.id}
	>
		{#each $Me.projects as project}
			<option value={project.id}>{project.name}</option>
		{/each}
	</select>
	<p>Vocabulary:</p>
	<select
		value={$VocabularySetting}
		bind:this={vocab_select_element}
		on:change={() => ($VocabularySetting = vocab_select_element.value)}
	>
		<option value="all">All</option>
		<option value="1a">1A</option>
		<option value="2a">2A</option>
		<option value="3a">3A</option>
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
