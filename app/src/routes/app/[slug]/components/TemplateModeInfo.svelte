<script lang="ts">
	import {
		AppProject,
		EditorTool,
		EditorTools,
		InEditMode,
		PageHistory,
		PageHistoryIndex,
		TemplatingPageId
	} from '$lib/client/stores';
	$: $TemplatingPageId =
		$AppProject.pages.find((page) => page.id === $PageHistory[$PageHistoryIndex + 1])?.id || null;
</script>

<section
	style={`transform: translateX(-50%) ${
		$InEditMode && $EditorTool === EditorTools.template ? 'scale(1.0)' : 'scale(0.0)'
	};
					pointer-events: ${$InEditMode && $EditorTool === EditorTools.template ? 'all' : 'none'};`}
>
	<b
		>Templating from:
		<select
			on:change={(e) => ($TemplatingPageId = parseInt(e.target.value + '') || null)}
			value={$AppProject.pages.find((page) => page.id === $PageHistory[$PageHistoryIndex + 1])?.id}
		>
			{#each $AppProject.pages as page}
				<option value={page.id}>{page.name}</option>
			{/each}
		</select>
	</b>
</section>

<style>
	section {
		background: var(--primary-300);
		color: var(--primary-text);
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--primary-500);
		bottom: 145px;
		left: 50%;
		transform: translateX(-50%);
		position: fixed;
		background-image: linear-gradient(to right, var(--primary-400) 1px, transparent 1px),
			linear-gradient(to bottom, var(--primary-400) 1px, transparent 1px);
		background-size: 15px 15px;
	}

	select {
		filter: none;
		background: rgba(23, 29, 91, 0.332);
		border: none;
	}

	@media (max-width: 750px) {
		section {
			bottom: 195px;
		}
	}
</style>
