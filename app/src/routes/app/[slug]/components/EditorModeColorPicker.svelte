<script lang="ts">
	//@ts-nocheck
	import {
		EditorTool,
		EditorTools,
		InEditMode,
		SelectedColor,
		SelectedColorMode
	} from '$lib/client/stores';

	let section: HTMLElement;
	let shades_section: HTMLElement;
	let options_section: HTMLElement;
	let is_color_picker_open = false;

	const close_color_picker = () => {
		if (!section) return;
		section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(0.00)';
				}, 40 * index);
			}
		});
		shades_section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(0.00)';
				}, 40 * index);
			}
		});
		options_section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(0.00)';
				}, 40 * index);
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
				}, 40 * index);
			}
		});
		shades_section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(1.00)';
				}, 40 * index);
			}
		});
		options_section.childNodes.forEach(async (child, index) => {
			if (child.style) {
				// change opacity to 0 after 10 ms
				setTimeout(() => {
					child.style.transform = 'scale(1.00)';
				}, 40 * index);
			}
		});
	};

	let selected_color = 'vermilion';
	let selected_shade = '300';
	const colors = [
		'grayscale',
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
			is_color_picker_open = false;
		} else if ($EditorTool == EditorTools.color && !is_color_picker_open) {
			open_color_picker();
			is_color_picker_open = true;
		}
		$SelectedColor = `var(--${selected_color}-${selected_shade})`;
	}
</script>

<main
	style={`transform: translateX(-50%) ${
		$EditorTool === EditorTools.color ? 'scale(1.0)' : 'scale(0.8)'
	};
		pointer-events: ${$EditorTool === EditorTools.color ? 'all' : 'none'};
	}`}
>
	<section style={`opacity: ${$EditorTool === EditorTools.color ? '1' : '0'};`} bind:this={section}>
		{#each colors as color}
			<div
				class={selected_shade === '300' && selected_color === color ? 'selected' : ''}
				on:click={() => {
					selected_color = color;
					selected_shade = '300';
				}}
				on:keypress={() => null}
				style={`--color: var(--${color}-300)`}
			/>
		{/each}
	</section>
	<span
		bind:this={shades_section}
		style={`opacity: ${$EditorTool === EditorTools.color ? '1' : '0'}; left: 0;`}
	>
		<div
			on:click={() => (selected_shade = '100')}
			on:keypress={() => null}
			class={selected_shade === '100' ? 'selected' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-100)`}
		/>
		<div
			on:click={() => (selected_shade = '200')}
			on:keypress={() => null}
			class={selected_shade === '200' ? 'selected' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-200)`}
		/>
		<div
			on:click={() => (selected_shade = '400')}
			on:keypress={() => null}
			class={selected_shade === '400' ? 'selected' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-400)`}
		/>
		<div
			on:click={() => (selected_shade = '500')}
			on:keypress={() => null}
			class={selected_shade === '500' ? 'selected' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-500)`}
		/>
	</span>
	<span
		bind:this={options_section}
		class="options"
		style={`opacity: ${$EditorTool === EditorTools.color ? '1' : '0'}; color: ${
			$SelectedColor === 'var(--grayscale-500)' ? 'black' : 'auto'
		}; right: 0px;`}
	>
		<div
			on:click={() => ($SelectedColorMode = 'border')}
			on:keypress={() => null}
			class={$SelectedColorMode === 'border' ? 'selected-option' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bx-border-all" />
		</div>
		<div
			on:click={() => ($SelectedColorMode = 'background')}
			on:keypress={() => null}
			class={$SelectedColorMode === 'background' ? 'selected-option' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bxs-brush" />
		</div>
		<div
			on:click={() => ($SelectedColorMode = 'text')}
			on:keypress={() => null}
			class={$SelectedColorMode === 'text' ? 'selected-option' : ''}
			style={`transform: scale(1.0); --color: var(--${selected_color}-${selected_shade});`}
		>
			<i class="bx bx-text" />
		</div>
	</span>
</main>

<style>
	main {
		position: relative;
		position: fixed;
		bottom: 145px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
	}
	section {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
		background-color: var(--base-100);
		padding: 10px;
		border-radius: 0 0 10px 10px;
	}

	div {
		width: 45px;
		height: 45px;
		border-radius: 5px;
		cursor: pointer;
		background-color: var(--color);
		transform: scale(0);
		position: relative;
		filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.131));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
	}

	span {
		position: absolute;
		top: -55px;
		display: flex;
		gap: 10px;
		background-color: var(--base-100);
		padding: 10px;
		padding-bottom: 0px;
		border-radius: 10px 10px 0 0;
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

	@media (max-width: 750px) {
		div {
			width: 30px;
			height: 30px;
		}
		span {
			top: -40px;
		}

		i {
			font-size: 20px;
		}
		main {
			bottom: 195px;
		}
	}
</style>
