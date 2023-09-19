<script lang="ts">
	import { Loading, openModal } from '$ts/client/stores';
	import ModalShell from './ModalShell.svelte';
	import ImageResize from 'image-resize';

	export let image: string;
	export let handleImageChange: (newImage: string) => void;
	export let handleNavigateBack: () => void;

	let searchingOnlineImages = true;
	let onlineSearchTerm = $openModal.props.search || '';
	let imageSearchResults: { image_url: string; name: string }[] = [];
	let searching = false;

	const skinTones = [
		{
			name: 'dark',
			pigmentHexValue: '#774837'
		},
		{
			name: 'medium-dark',
			pigmentHexValue: '#af7450'
		},
		{
			name: 'medium',
			pigmentHexValue: '#d7a481'
		},
		{
			name: 'medium-light',
			pigmentHexValue: '#f6cc9d'
		},
		{
			name: 'light',
			pigmentHexValue: '#fadbca'
		}
	];

	let selectedSkinTone = '#d7a481';

	let selectedSearchStrategy = 'google';

	const imageResize = new ImageResize({
		format: 'png',
		width: 800,
		height: 800
	});

	const handleUploadFromInternet = async (url: string) => {
		// convert url into base64
		const response = await fetch(url);
		const blob = await response.blob();
		const base64data = await imageResize.play(blob);

		$Loading = true;
		const uploadImageResponse = await fetch('/api/v1/media/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: url.split('/').pop(),
				base64data: (base64data + '').split(',')[1]
			})
		});
		$Loading = false;

		const data = await uploadImageResponse.json();

		if (data.fileurl) {
			image = data.fileurl;
			handleImageChange(data.fileurl);
			searchingOnlineImages = false;
		}

		handleNavigateBack();
	};

	const searchImages = async () => {
		searching = true;
		const response = await fetch(
			`/api/v1/media/search/${selectedSearchStrategy}?query=${encodeURIComponent(onlineSearchTerm)}`
		);
		searching = false;
		const data = await response.json();
		if (data.results) imageSearchResults = data.results;
	};
</script>

<ModalShell title="Edit Tile">
	<button on:click={handleNavigateBack} class="mb-2 flex items-center gap-1 text-sm text-zinc-300">
		<i class="bi bi-arrow-left" />
		Back
	</button>

	<div class="flex gap-4 py-4">
		<button
			on:click={() => (selectedSearchStrategy = 'google')}
			class={selectedSearchStrategy === 'google' ? 'underline' : ''}>Google Images</button
		>
		<button
			on:click={() => (selectedSearchStrategy = 'open-symbols')}
			class={selectedSearchStrategy === 'open-symbols' ? 'underline' : ''}>Open Symbols</button
		>
	</div>

	{#if selectedSearchStrategy === 'open-symbols'}
		<div class="item-center flex items-center gap-1 pb-4">
			<p class="pr-3">Skin tone:</p>
			{#each ['#774837', '#af7450', '#d7a481', '#f6cc9d', '#fadbca'] as pigmentHexValue}
				<button
					on:click={() => (selectedSkinTone = pigmentHexValue)}
					class={`h-[40px] flex-1 rounded-sm ${
						selectedSkinTone === pigmentHexValue
							? 'scale-90 ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
							: ''
					}`}
					style={`background-color: ${pigmentHexValue}`}
				>
				</button>
			{/each}
		</div>
	{/if}

	<div class="mb-2 flex items-center gap-2">
		<div
			class="flex flex-1 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 text-zinc-800"
		>
			<i class="bi bi-search" />
			<input
				type="text"
				bind:value={onlineSearchTerm}
				on:keydown={(e) => {
					if (e.key === 'Enter') searchImages();
				}}
				placeholder="Search for images on Google..."
				class="flex-1 border-none outline-none"
			/>
		</div>
		<button on:click={searchImages} class="rounded-md border border-blue-500 bg-blue-600 p-1 px-4"
			>{searching ? 'Searching...' : 'Search'}</button
		>
	</div>
	<div class="grid max-h-[500px] min-h-[300px] grid-cols-2 gap-2 overflow-y-auto">
		{#each imageSearchResults as image}
			<button
				disabled={searching}
				on:click={() =>
					handleUploadFromInternet(
						image.image_url.replaceAll(
							'varianted-skin',
							`variant-${skinTones.find((tone) => tone.pigmentHexValue === selectedSkinTone)?.name}`
						)
					)}
			>
				<img
					class="w-full"
					src={image.image_url.replaceAll(
						'varianted-skin',
						`variant-${skinTones.find((tone) => tone.pigmentHexValue === selectedSkinTone)?.name}`
					)}
					alt={image.name}
				/>
			</button>
		{/each}
	</div>
</ModalShell>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-1 px-2 text-zinc-800;
	}
</style>
