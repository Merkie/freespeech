<script lang="ts">
	//@ts-nocheck
	import { EditorTool, EditorTools, InEditMode } from '$lib/client/stores';

	let section: HTMLElement;
	let shades_section: HTMLElement;

	let selected_option = 'border';

	const close_color_picker = () => {
		if (!section) return;
		section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(0.00)';
				}, 10 * index);
			}
		});
	};

	const open_color_picker = () => {
		if (!section) return;
		section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(1.00)';
				}, 10 * index);
			}
		});
	};

	let selected_color = 'vermilion';
	let selected_shade = '300';
	const colors = [
		'vermilion',
		'rose',
		'violet',
		'indigo',
		'cerulean',
		'turquoise',
		'forest',
		'lime',
		'gold',
		'sepia'
	];

	$: {
		if ($EditorTool != EditorTools.color || !$InEditMode) {
			close_color_picker();
		} else if ($EditorTool == EditorTools.color) {
			open_color_picker();
		}
	}
</script>

<section bind:this={section}>
	{#each colors as color}
		<div
			class={selected_shade === '300' && selected_color === color ? 'selected' : ''}
			on:click={() => {
				selected_color = color;
				selected_shade = '300';
			}}
			style={`--color: var(--${color}-300)`}
		/>
	{/each}
	<span style={`left: 0; transform: scale(${$EditorTool === EditorTools.color ? '1.0' : '0.0'});`}>
		<div
			on:click={() => (selected_shade = '100')}
			class={selected_shade === '100' ? 'selected' : ''}
			style={`--color: var(--${selected_color}-100)`}
		/>
		<div
			on:click={() => (selected_shade = '200')}
			class={selected_shade === '200' ? 'selected' : ''}
			style={`--color: var(--${selected_color}-200)`}
		/>
		<div
			on:click={() => (selected_shade = '400')}
			class={selected_shade === '400' ? 'selected' : ''}
			style={`--color: var(--${selected_color}-400)`}
		/>
		<div
			on:click={() => (selected_shade = '500')}
			class={selected_shade === '500' ? 'selected' : ''}
			style={`--color: var(--${selected_color}-500)`}
		/>
	</span>
	<span class="options" style={`right: 0; transform: scale(${$EditorTool === EditorTools.color ? '1.0' : '0.0'});`}>
		<div
			on:click={() => (selected_option = 'border')}
			class={selected_option === 'border' ? 'selected-option' : ''}
			style={`--color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bx-border-all" />
		</div>
		<div
			on:click={() => (selected_option = 'background')}
			class={selected_option === 'background' ? 'selected-option' : ''}
			style={`--color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bxs-brush" />
		</div>
		<div
			on:click={() => (selected_option = 'text')}
			class={selected_option === 'text' ? 'selected-option' : ''}
			style={`--color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bx-text" />
		</div>
	</span>
</section>

<style>
	section {
		position: fixed;
		bottom: 145px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
	}

	div {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		cursor: pointer;
		background-color: var(--color);
		transform: scale(0);
		position: relative;
		filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.131));
		display: flex;
		align-items: center;
		justify-content: center;
	}

	span {
		position: absolute;
		top: -40px;
		display: flex;
		gap: 10px;
	}

	span div {
		transform: scale(1) !important;
	}

	div:hover {
		transform: scale(1) translateY(-2px) !important;
	}
	div:active {
		transform: scale(1) translateY(2px) !important;
	}
	.selected {
		border-radius: 50%;
	}
	.options div {
		opacity: 0.5;
	}
	.selected-option {
		opacity: 1 !important;
	}
</style>
