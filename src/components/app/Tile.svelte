<script lang="ts">
	import EditTileModal from '$components/modals/EditTileModal.svelte';
	import { ActivePage, ActiveProject, AppMode } from '$ts/client/stores';
	import type { TilePage } from '@prisma/client';

	export let text: string;
	export let image = '';
	export let navigation = '';
	export let x: number;
	export let y: number;
	export let color: string = 'white';
	export let subpage: number;

	let editingTileModalOpen = false;

	const speakTileText = () => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'en-US';
		speechSynthesis.speak(utterance);
	};

	const handleInteraction = () => {
		// Edit Mode
		if ($AppMode === 'edit') {
			editingTileModalOpen = true;
			return;
		}
		// Speak the text
		speakTileText();
		// Handle navigation
		if ($ActiveProject?.pages.map((page) => page.name).includes(navigation)) {
			$ActivePage = navigation;
			return;
		}
	};

	const addTileEditToStore = () => {
		// active project contains pages which is a list of objects that each contain a property called data which is an object that contains a list called tiles which is a list of objects that are the tiles, we can just replace the tile object of the current one {x, y, text}
		// @ts-ignore
		if (!$ActiveProject) return;
		$ActiveProject = {
			...$ActiveProject,
			pages: $ActiveProject.pages.map((page) => {
				if (page.name !== $ActivePage) return page;
				return {
					...page,
					data: {
						// @ts-ignore
						...page.data,
						// @ts-ignore
						tiles: page.data.tiles.map((tile) => {
							if (tile.x === x && tile.y === y && tile.page === subpage)
								return { x, y, text, image, navigation, page: subpage, color };
							return tile;
						})
					}
				} as TilePage;
			})
		};
	};

	const deleteTile = () => {
		if (!$ActiveProject) return;
		$ActiveProject = {
			...$ActiveProject,
			pages: $ActiveProject.pages.map((page) => {
				if (page.name !== $ActivePage) return page;
				return {
					...page,
					data: {
						// @ts-ignore
						...page.data,
						// @ts-ignore
						tiles: page.data.tiles.filter(
							// @ts-ignore
							(tile) => !(tile.x === x && tile.y === y && tile.page === subpage)
						)
					}
				} as TilePage;
			})
		};
	};
</script>

{#if editingTileModalOpen}
	<EditTileModal
		handleTextChange={(newText) => {
			text = newText;
			addTileEditToStore();
		}}
		handleImageChange={(newImage) => {
			image = newImage;
			addTileEditToStore();
		}}
		handleNavigationChange={(newNavigation) => {
			navigation = newNavigation;
			addTileEditToStore();
		}}
		handleColorChange={(newColor) => {
			color = newColor;
			addTileEditToStore();
		}}
		{deleteTile}
		{text}
		{image}
		{navigation}
		closeModal={() => (editingTileModalOpen = false)}
	/>
{/if}

<button
	on:click={handleInteraction}
	style={`grid-row: ${y + 1}; grid-column: ${x + 1};`}
	class={`w-full h-full bg-${color === 'white' ? 'zinc' : color}-${
		color === 'zinc' ? '50' : '100'
	} text-${color === 'white' ? 'zinc' : color}-950 border border-${
		color === 'white' ? 'zinc' : color
	}-500 rounded-md ${
		image ? 'flex flex-col items-center overflow-hidden' : 'grid place-items-center'
	}`}
>
	<p class={`text-ellipsis ${!image ? 'text-[2vw]' : 'py-2'}`}>{text}</p>
	{#if image}
		<div class="flex-1 w-full relative">
			<img src={image} class="absolute w-full h-full object-contain" alt="Tile media" />
		</div>
	{/if}
</button>
