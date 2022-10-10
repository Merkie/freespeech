<script lang="ts">
	import { EditorTool, EditorTools, InEditMode } from '$lib/client/stores';
</script>

<section
	style={`transform: translateX(-50%) ${
		$InEditMode && $EditorTool === EditorTools.trash ? 'scale(1.0)' : 'scale(0.0)'
	};`}
>
	<b>Warning: You're currently in trash mode!</b>
</section>

<style>
	section {
		background: var(--danger-300);
		color: var(--danger-text);
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--danger-500);
		bottom: 145px;
		left: 50%;
		transform: translateX(-50%);
		position: fixed;
	}
</style>
