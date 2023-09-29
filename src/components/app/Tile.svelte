<script lang="ts">
	// import CropImageModal from '$components/modals/CropImageModal.svelte';
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
	import { getContext } from 'svelte';

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
		// Handle navigation
		if ($ActiveProject?.pages.map((page) => page.name).includes(navigation)) {
			$ActivePage = navigation;
			return;
		}
		// Add tile to store
		$Sentence = [...$Sentence, { text: displayText || text, image, color } as Tile];
		// Speak the text if the user has enabled the speak on tap setting
		if ($LocalSettings.speakOnTap) {
			speakText(text);
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

	const handleImageChange = (newImage: string) => {
		image = newImage;
	};
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
			$openModal = { name: 'search-online-images', key: tileSignature, props: { search: text } };
		}}
		{deleteTile}
		{text}
		{displayText}
		{image}
		{navigation}
		{color}
	/>
{/if}

<!-- {#if $openModal.name === 'crop-image' && $openModal.key === tileSignature}
	<CropImageModal
		{image}
		{handleImageChange}
		handleNavigateBack={() => ($openModal = { name: 'edit-tile', key: tileSignature })}
	/>
{/if} -->

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

<div class="relative h-full w-full">
	<button
		on:click={handleInteraction}
		class={`h-full w-full overflow-hidden border ${bgColorClass} ${textColorClass} ${borderColorClass} rounded-md ${
			image ? 'flex flex-col items-center' : 'grid place-items-center'
		}`}
	>
		<p class={`break-spaces text-ellipsis ${!image ? 'text-[2vw]' : 'py-2'}`}>
			{displayText || text}
		</p>
		{#if image}
			<div class="relative w-full flex-1">
				<img
					src={`${getContext('media_uri')}${image}`}
					class="absolute h-full w-full object-contain"
					alt="Tile media"
				/>
			</div>
		{/if}
	</button>
	{#if navigation}
		<div
			class={`absolute -top-1 left-0 h-[10px] rounded-t-md border border-b-0 ${bgColorClass} ${textColorClass} ${borderColorClass} w-[50%]`}
		/>
	{/if}
</div>
