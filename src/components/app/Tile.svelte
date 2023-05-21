<script lang="ts">
	import EditTileModal from '$components/modals/EditTileModal.svelte';
	import OnlineImageSearchModal from '$components/modals/OnlineImageSearchModal.svelte';
	import {
		ActivePage,
		ActiveProject,
		LocalSettings,
		Sentence,
		hasUnsavedChanges,
		isEditing,
		openModal
	} from '$ts/client/stores';
	import type { Tile, TilePage } from '$ts/common/types';

	export let text: string;
	export let displayText = '';
	export let image = '';
	export let navigation = '';
	export let x: number;
	export let y: number;
	export let color: string = 'white';
	export let subpage: number;
	export let speakText: (text: string) => void;

	const handleInteraction = () => {
		// Edit Mode
		if ($isEditing) {
			$hasUnsavedChanges = true;
			$openModal = { name: 'edit-tile', key: tileSignature };
			return;
		}
		// Add tile to store
		$Sentence = [...$Sentence, { text, image, color } as Tile];
		// Speak the text if the user has enabled the speak on tap setting
		if ($LocalSettings.speakOnTap) {
			speakText(text);
		}
		// Handle navigation
		if ($ActiveProject?.pages.map((page) => page.name).includes(navigation)) {
			$ActivePage = navigation;
			return;
		}
	};

	const addTileEditToStore = () => {
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
								return { x, y, text, displayText, image, navigation, page: subpage, color };
							return tile;
						})
					}
				} as TilePage;
			})
		};
	};

	const deleteTile = (key: string) => {
		if (tileSignature !== key) return;
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

	// Define variables for the background color, text color, and border color
	let bgColorClass: string;
	let textColorClass: string;
	let borderColorClass: string;

	let tileSignature = '';
	$: tileSignature = '' + x + y + subpage + $ActivePage;

	$: {
		bgColorClass =
			color === 'white' ? 'bg-white' : `bg-${color}-${color === 'zinc' ? '50' : '100'}`;
		textColorClass = color === 'white' ? 'text-zinc-950' : `text-${color}-950`;
		borderColorClass = color === 'white' ? 'border-zinc-500' : `border-${color}-500`;
	}
	$: {
		let _ = { x, y, text, displayText, image, navigation, color };
		addTileEditToStore();
	}
</script>

{#if $openModal.name === 'edit-tile' && $openModal.key === tileSignature}
	<EditTileModal
		handleTextChange={(newText) => {
			text = newText;
		}}
		handleDisplayTextChange={(newDisplayText) => {
			displayText = newDisplayText;
		}}
		handleImageChange={(newImage) => {
			image = newImage;
		}}
		handleNavigationChange={(newNavigation) => {
			navigation = newNavigation;
		}}
		handleColorChange={(newColor) => {
			color = newColor;
		}}
		handleOnlineImageSearch={() => {
			$openModal = { name: 'search-online-images', key: tileSignature };
		}}
		{deleteTile}
		{text}
		{displayText}
		{image}
		{navigation}
		{color}
	/>
{/if}

{#if $openModal.name === 'search-online-images' && $openModal.key === tileSignature}
	<OnlineImageSearchModal
		handleImageChange={(newImage) => {
			image = newImage;
		}}
		handleNavigateBack={() => {
			$openModal = { name: 'edit-tile', key: tileSignature };
		}}
		{image}
	/>
{/if}

<button
	on:click={handleInteraction}
	class={`w-full h-full border ${bgColorClass} ${textColorClass} ${borderColorClass} rounded-md ${
		image ? 'flex flex-col items-center overflow-hidden' : 'grid place-items-center'
	}`}
>
	<p class={`text-ellipsis ${!image ? 'text-[2vw]' : 'py-2'}`}>
		{displayText || text}
	</p>
	{#if image}
		<div class="flex-1 w-full relative">
			<img src={image} class="absolute w-full h-full object-contain" alt="Tile media" />
		</div>
	{/if}
</button>
