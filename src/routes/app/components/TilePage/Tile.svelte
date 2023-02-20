<script lang="ts">
	import { clickOutside } from 'svelte-use-click-outside';
	import {
		AppMode,
		CurrentPage,
		CurrentProject,
		EditModeNavigation,
		SelectedEditModeTool,
		Sentence,
		EditModeColor,
		TemplateMode
	} from '$lib/stores';
	import type { Page, Tile, Project } from '$lib/types';
	import { scale } from 'svelte/transition';
	import urlToBase64 from '$lib/helpers/urlToBase64';
	import { updateTile } from '$lib/helpers/tileActions';

	export let tile: Tile;

	let editingTileText = false;
	let draggingFileOver = false;

	let tileTextInput: HTMLInputElement | null = null;
	let fileInput: HTMLInputElement;

	let imageBase64: string;

	// Handles the events that occur when a user taps or clicks a tile
	const handleInteraction = async () => {
		if ($AppMode === 'edit') {
			if ($SelectedEditModeTool === 'text') {
				editingTileText = true;
				// force focus
				setTimeout(() => {
					tileTextInput?.focus();
					// tileTextInput?.setSelectionRange(0, tileTextInput?.value.length);
				}, 0);
			} else if ($SelectedEditModeTool === 'navigation') {
				$EditModeNavigation = { tileid: tile._id, pagename: undefined };
			} else if ($SelectedEditModeTool === 'image') {
				// If the tile already has an image, delete it
				if (tile.image) {
					// delete the image
					await fetch('/api/v1/cloud/delete', {
						method: 'POST',
						body: JSON.stringify({
							location: tile.image
						})
					});
					// remove the image
					updateTile({
						tilePage: $CurrentPage,
						tileId: tile._id,
						newTile: {
							...tile,
							image: ''
						}
					});
				} else {
					// If not, open the file input
					fileInput.click();
				}
			} else if ($SelectedEditModeTool === 'accent') {
				updateTile({
					tilePage: $CurrentPage,
					tileId: tile._id,
					newTile: {
						...tile,
						isAccented: tile.isAccented ? false : true
					}
				});
			} else if ($SelectedEditModeTool === 'color') {
				updateTile({
					tilePage: $CurrentPage,
					tileId: tile._id,
					newTile: {
						...tile,
						[$EditModeColor.mode + 'Color']: `${$EditModeColor.color}-${$EditModeColor.value}`
					}
				});
			} else if ($SelectedEditModeTool === 'trash') {
				if (tile.image) {
					await fetch('/api/v1/cloud/delete', {
						method: 'POST',
						body: JSON.stringify({
							location: tile.image
						})
					});
				}
				$CurrentProject = {
					...$CurrentProject,
					pages: $CurrentProject?.pages.map((page: Page & { tiles: Tile[] }) => {
						if (page.name !== $CurrentPage) return page;
						return {
							...page,
							tiles: page.tiles.filter((_tile: Tile) => {
								return tile._id !== _tile._id;
							})
						};
					})
				} as Project;
			} else if ($SelectedEditModeTool === 'template') {
				if (($TemplateMode.tiles || []).find((_tile) => _tile.x === tile.x && _tile.y === tile.y)) {
					$TemplateMode = {
						...$TemplateMode,
						tiles: $TemplateMode.tiles.filter(
							(_tile) => !(_tile.x === tile.x && _tile.y === tile.y)
						)
					};
					return;
				}
				$TemplateMode = {
					...$TemplateMode,
					tiles: [...($TemplateMode.tiles || []), { x: tile.x, y: tile.y }]
				};
			}
		} else {
			if (tile.navigateTo) {
				$CurrentPage = tile.navigateTo;
				return;
			} else {
				$Sentence = [...$Sentence, tile];
			}
		}
	};

	// Handles the events that occur when a user clicks outside of the tile
	const handleOutsideClick = () => {
		// If editing tile text, update the tile and cancel the state
		if (editingTileText) {
			const updatedTile = {
				...tile,
				text: tileTextInput?.value || ''
			};
			updateTile({
				tilePage: $CurrentPage,
				tileId: tile._id,
				newTile: updatedTile
			});
			editingTileText = false;
		}
	};

	// Handles the file upload when upload an image
	const handleUpload = async () => {
		// Cancel the state
		draggingFileOver = false;
		// Get the file
		const file = fileInput.files?.[0];
		// If there is no file, return
		if (!file) return;

		// Convert the file to base64
		const reader = new FileReader();
		const base64Promise = new Promise((resolve, reject) => {
			reader.onloadend = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
		reader.readAsDataURL(file);
		// Image represented as a base64 string
		const image = await base64Promise;

		// if the tile already has an image, delete it
		if (tile.image) {
			await fetch('/api/v1/cloud/delete', {
				method: 'POST',
				body: JSON.stringify({
					location: tile.image
				})
			});
		}

		// Upload the image to the cloud
		const imageUploadResponse = await (
			await fetch('/api/v1/cloud/upload', {
				method: 'POST',
				body: JSON.stringify({
					data: image
				})
			})
		).json();

		// Update the tile with the new image
		updateTile({
			tilePage: $CurrentPage,
			tileId: tile._id,
			newTile: {
				...tile,
				image: imageUploadResponse.location
			}
		});
	};

	// Convert the image url to a base64 string for rendering
	$: {
		if (tile.image) {
			urlToBase64(tile.image).then((base64) => {
				imageBase64 = base64 as string;
			});
		}
	}

	$: {
		// This triggers when the user is updating the navigation of a tile
		if ($EditModeNavigation.tileid && $EditModeNavigation.pagename) {
			updateTile({
				tilePage: $CurrentPage,
				tileId: tile._id,
				newTile: {
					...tile,
					navigateTo: $EditModeNavigation.pagename
				}
			});
			$EditModeNavigation = { tileid: undefined, pagename: undefined };
		}
	}
</script>

<button
	on:dragenter={() => {
		if ($AppMode === 'edit' && $SelectedEditModeTool === 'image') {
			draggingFileOver = true;
		}
	}}
	on:dragleave={() => (draggingFileOver = false)}
	use:clickOutside={handleOutsideClick}
	in:scale={{ duration: 300, delay: Math.random() * 200 }}
	on:click={handleInteraction}
	class={`border relative p-2 rounded-sm ${
		!draggingFileOver &&
		!(
			$EditModeNavigation.tileid === tile._id &&
			$AppMode === 'edit' &&
			$SelectedEditModeTool === 'navigation'
		)
			? `bg-${tile.backgroundColor || 'zinc-100'} border-${tile.borderColor || 'zinc-400'} text-${
					tile.textColor || 'zinc-800'
			  }`
			: ''
	} ${draggingFileOver ? 'bg-emerald-600 border-emerald-400 text-emerald-100' : ''} ${
		$EditModeNavigation.tileid === tile._id &&
		$AppMode === 'edit' &&
		$SelectedEditModeTool === 'navigation'
			? 'bg-blue-500 border-blue-700 text-blue-50 border-dashed'
			: ''
	}`}
>
	<!-- Template mode bubble -->
	{#if $TemplateMode.mode !== 'disabled' && $AppMode === 'edit' && $SelectedEditModeTool === 'template'}
		{#if ($TemplateMode.tiles || []).find((_tile) => _tile.x === tile.x && _tile.y === tile.y)}
			<div
				class="absolute bg-blue-600 border border-blue-400 w-[20px] h-[20px] -top-[5px] -right-[5px] rounded-full text-white flex items-center justify-center cursor-pointer"
			>
				<i class="bi bi-check" />
			</div>
		{:else}
			<div
				class="absolute border-2 border-zinc-400 border-dashed w-[20px] h-[20px] -top-[5px] -right-[5px] rounded-full text-white flex items-center justify-center cursor-pointer"
			/>
		{/if}
	{/if}

	{#if !draggingFileOver}
		<!-- Regular Tile Content -->
		<div
			class={`absolute overflow-hidden rounded-sm left-0 p-2 top-0 w-full h-full flex gap-2 flex-col items-center justify-center`}
		>
			<!-- Tile Accent -->
			<div
				class={`transition absolute rotate-45 bg-${
					tile.borderColor || 'zinc-400'
				} w-[50px] h-[50px] right-0 top-0 ${
					tile.isAccented ? 'translate-x-8 -translate-y-8' : 'translate-x-12 -translate-y-12'
				}`}
			/>

			<!-- Tile Text -->
			{#if editingTileText}
				<input size={10} class="text-center w-fit" bind:this={tileTextInput} value={tile.text} />
			{:else}
				<p>{tile.text}</p>
			{/if}

			<!-- Tile Image -->
			{#if tile.image}
				<div class="relative flex-1 w-full">
					<img
						class="absolute mix-blend-multiply h-full left-1/2 -translate-x-1/2"
						src={imageBase64 || ''}
						alt=""
					/>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Plus sign for dropzone indicator -->
		<i class="bi bi-plus-lg text-xl" />
	{/if}
	<!-- Hidden input element shown when editing image -->
	{#if $AppMode === 'edit' && $SelectedEditModeTool === 'image' && !tile.image}
		<input
			bind:this={fileInput}
			on:input={handleUpload}
			type="file"
			class="absolute top-0 left-0 w-full h-full opacity-0 http://127.0.0.1:5173/"
		/>
	{/if}
	<!-- Folder Icon -->
	{#if tile.navigateTo}
		<i class="bi bi-folder bottom-1 right-2 absolute" />
	{/if}
</button>
