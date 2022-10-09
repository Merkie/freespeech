<script lang="ts">
	import { EditorTool, EditorTools } from '$lib/client/stores';
	import { InEditMode } from '$lib/client/stores';
</script>

<section style={`bottom: ${$InEditMode ? '62px' : '-60px'}`}>
	<b>Tools</b>
	<div>
		<button
			class={$EditorTool === EditorTools.text ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.text)}
		>
			<i class="bx bx-text" />
			<p>Text</p>
		</button>
		<button
			disabled={true}
			class={$EditorTool === EditorTools.image ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.image)}
		>
			<i class="bx bxs-image-add" />
			<p>Image</p>
		</button>
		<button
			disabled={true}
			class={$EditorTool === EditorTools.move ? 'selected' : ''}
			on:click={() => ($EditorTool = EditorTools.move)}
		>
			<i class="bx bx-move" />
			<p>Move</p>
		</button>
		<button
			disabled={true}
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
			disabled={true}
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
		height: 93px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border: 1px solid var(--base-400);
		border-bottom: 0;
		background: var(--base-100);
		padding: 10px;
		text-align: center;
	}
	div {
		margin-top: 10px;
		display: flex;
		gap: 10px;
	}
	button {
		background: var(--base-200);
		border: 1px solid var(--base-400);
		min-width: 100px;
	}
	button i {
		font-size: 20px;
	}
	button p {
		font-size: 15px;
	}
	.selected {
		background: var(--primary-300);
		border: 1px solid var(--primary-400);
	}
</style>
