<script lang="ts">
	// Stores
	import { EditorTool, EditorTools, InEditMode, PageHistory, PageHistoryIndex } from '$lib/client/stores';
</script>

<section style={`--open-height: 62px; bottom: ${$InEditMode ? 'var(--open-height)' : '-60px'}`}>
	<div>
		<button
			class={$EditorTool === EditorTools.text ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.text)}
		>
			<i class="bx bx-text" />
			<p>Text</p>
		</button>
		<button
			class={$EditorTool === EditorTools.image ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.image)}
		>
			<i class="bx bxs-image-add" />
			<p>Image</p>
		</button>
		<button
			class={$EditorTool === EditorTools.color ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.color)}
		>
			<i class="bx bxs-palette" />
			<p>Color</p>
		</button>
		<button
			class={$EditorTool === EditorTools.accent ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.accent)}
		>
			<i class="bx bxs-bookmark" />
			<p>Accent</p>
		</button>
		<button
			class={$EditorTool === EditorTools.invisible ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.invisible)}
		>
			<i class="bx bxs-hide" />
			<p>Invisible</p>
		</button>
		<button
			class={$EditorTool === EditorTools.navigate ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.navigate)}
		>
			<i class="bx bxs-navigation" />
			<p>Navigate</p>
		</button>
		<button
			disabled={(!($PageHistory.length > 1) && !($PageHistoryIndex > 0)) || ($PageHistoryIndex === $PageHistory.length - 1)}
			class={$EditorTool === EditorTools.template ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.template)}
		>
			<i class="bx bx-link" />
			<p>Template</p>
		</button>
		<button
			class={$EditorTool === EditorTools.trash ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.trash)}
		>
			<i class="bx bxs-trash-alt" />
			<p>Trash</p>
		</button>
	</div>
</section>

<style>
	section {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		height: 53px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border: 1px solid var(--base-400);
		border-bottom: 0;
		background: var(--base-100);
		padding: 10px;
		text-align: center;
	}
	div {
		display: flex;
		gap: 10px;
		background: var(--base-200);
		border-radius: 10px;
	}
	button {
		background: var(--base-200);
		border: 1px solid var(--base-400);
		background: none;
		border: none;
		width: 50px !important;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0.5;
	}
	button i {
		font-size: 30px;
	}
	button p {
		font-size: 12px;
		opacity: 0;
	}

	.selected {
		opacity: 1;
	}
	.selected p {
		display: block;
		opacity: 1;
	}

	@media (max-width: 750px) {
		section {
			--open-height: 57px !important;
		}

		div {
			padding: 0 10px;
		}

		button {
			width: 40px !important;
		}
	}
</style>
