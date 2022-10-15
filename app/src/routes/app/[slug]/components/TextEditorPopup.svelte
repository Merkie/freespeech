<script lang="ts">
	import {
		EditorTool,
		EditorTools,
		InEditMode,
		EditTextMode
	} from '$lib/client/stores';
</script>

<section
	style={`transform: translateX(-50%) ${
		$InEditMode && $EditorTool === EditorTools.text ? 'scale(1.0)' : 'scale(0.0)'
	};
		pointer-events: ${$EditorTool === EditorTools.text ? 'all' : 'none'};`}
>
	<span><b>Editing: </b><select bind:value={$EditTextMode}>
		<option value="display">Display Text</option>
		<option value="speak">Speak Text</option>
	</select></span>
</section>

<style>
	section {
		background: var(--base-100);
		color: var(--primary-text);
		padding: 10px 20px;
		border-radius: 5px;
		border: 1px solid var(--border-400);
		bottom: 145px;
		left: 50%;
		transform: translateX(-50%);
		position: fixed;
		pointer-events: none;
	}

	@media (max-width: 750px) {
		section {
			bottom: 195px;
		}
	}
</style>
