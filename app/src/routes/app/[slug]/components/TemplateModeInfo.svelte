<script lang="ts">
	import {
		AppProject,
		EditorTool,
		EditorTools,
		InEditMode,
		PageHistory,
		PageHistoryIndex
	} from '$lib/client/stores';
	let page_name: string;
	$: page_name =
		$AppProject.pages.find((page) => page.id === $PageHistory[$PageHistoryIndex + 1])?.name + '';
</script>

<section
	style={`transform: translateX(-50%) ${
		$InEditMode && $EditorTool === EditorTools.template ? 'scale(1.0)' : 'scale(0.0)'
	};`}
>
	<b>Templating from: {page_name}</b>
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
		pointer-events: none;
	}

	@media (max-width: 750px) {
		section {
			bottom: 195px;
		}
	}
</style>
