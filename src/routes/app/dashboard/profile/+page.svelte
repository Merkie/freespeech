<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { ActiveProject, Loading } from '$ts/client/stores';
	import { getContext } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let profileInput: HTMLInputElement;

	let editingElevenLabsApiKey = false;

	let name = data.user?.name;
	let elevenLabsApiKey = data.elevenLabsApiKey;

	const logout = async () => {
		await fetch('/api/v1/auth/logout');
		$ActiveProject = null;
		window.location.assign('/');
	};

	const getUserInitials = () => {
		const name = data.user?.name;
		if (!name) return '';
		const names = name.split(' ');
		if (names.length === 1) return names[0].charAt(0);
		return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
	};

	const updateUser = async () => {
		const response = await fetch('/api/v1/user/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, elevenLabsApiKey })
		});
		await invalidateAll();
	};

	const handleMediaUpload = async () => {
		if (!profileInput.files) return;
		const uploadedFile = profileInput.files[0];

		$Loading = true;

		const presignResponse = await fetch('/api/v1/media/upload/presign', {
			method: 'POST',
			body: JSON.stringify({
				filename: uploadedFile.name
			})
		}).then((res) => res.json());

		const uploadResponse = await fetch(presignResponse.presignedUrl, {
			method: 'PUT',
			body: uploadedFile
		});

		$Loading = false;

		if (uploadResponse.status === 200) {
			const response = await fetch('/api/v1/user/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ profileImgUrl: `/${presignResponse.key}` })
			});
			await invalidateAll();
		}
	};
</script>

<div class="flex h-full justify-center">
	<div class="flex w-[90%] max-w-[1000px] flex-col p-4 sm:flex-row">
		<div class="flex flex-col items-center p-2 sm:w-fit sm:items-start">
			{#if data.user.profileImgUrl}
				<img
					src={`${getContext('media_uri')}${data.user.profileImgUrl}`}
					alt="Profile"
					class="h-[150px] w-[150px] rounded-full"
				/>
			{:else}
				<p
					class="grid h-[150px] w-[150px] place-items-center rounded-full bg-blue-500 text-3xl font-bold text-blue-50"
				>
					{getUserInitials()}
				</p>
			{/if}

			<div>
				<p class="mt-2 text-lg font-medium">{data.user?.name}</p>
				<p class="items-cetner flex text-sm">
					<span>{data.user?.email}</span>
					{#if data.user?.emailVerified}
						<i class="bi bi-envelope-check ml-2 translate-y-[1px]" />
					{/if}
				</p>
			</div>

			<button
				on:click={logout}
				class="mt-2 w-[200px] rounded-md border border-red-500 bg-red-600 p-1 text-sm text-red-50 sm:w-full"
				>Logout</button
			>
		</div>
		<div class="flex flex-1 flex-col overflow-y-auto px-2">
			<div class="flex flex-col gap-2">
				<p class="text-lg">Email</p>
				<input type="text" value={data.user?.email} disabled={true} />
				<p class="text-lg">Name</p>
				<input type="text" bind:value={name} />
				<!-- profile pic -->
				<p class="text-lg">Profile Picture</p>
				<button
					on:click={(e) => {
						e.preventDefault();
						profileInput.click();
					}}
					class="rounded-md border border-zinc-300 bg-zinc-200 p-2 px-4 text-zinc-500"
					><i class="bi bi-image mr-2" />Upload Profile Picture</button
				>
				<input on:input={handleMediaUpload} bind:this={profileInput} type="file" class="hidden" />
				<p class="text-lg">ElevenLabs API Key</p>

				{#if editingElevenLabsApiKey}
					<input bind:value={elevenLabsApiKey} type="text" />
				{:else}
					<button
						on:click={() => (editingElevenLabsApiKey = true)}
						class="mt-2 rounded-md border border-zinc-500 bg-zinc-600 p-2 px-4 text-zinc-50"
						><i class="bi bi-eye mr-2"></i> Show API Key</button
					>
				{/if}

				<button
					on:click={updateUser}
					type="submit"
					class="mt-2 rounded-md border border-blue-400 bg-blue-500 p-2 px-4 text-blue-50"
					>Submit Changes</button
				>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}

	input:disabled {
		@apply opacity-75;
	}
</style>
