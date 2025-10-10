<script lang="ts">
	import ModalUploadProfilePicture from './_components/ModalUploadProfilePicture.svelte';
	import { invalidateAll } from '$app/navigation';
	import api from '$ts/client/api';
	import { PUBLIC_R2_URL } from '$env/static/public';

	let { data } = $props();

	let isUploadProfilePictureModalOpen = $state(false);

	let name = $state(data.user?.name);

	const logout = async () => {
		await fetch('/api/logout');
		window.localStorage.setItem('token', '');
		await invalidateAll();
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
		await api.user.update({ name });
		await invalidateAll();
	};
</script>

<div class="flex h-full justify-center">
	<div class="flex w-[90%] max-w-[1000px] flex-col p-4 sm:flex-row">
		<div class="flex flex-col items-center p-2 sm:w-fit sm:items-start">
			{#if data.user.profileImgUrl}
				<img
					src={data.user.profileImgUrl?.startsWith('http')
						? data.user.profileImgUrl
						: `${PUBLIC_R2_URL}${data.user.profileImgUrl}`}
					alt="Profile"
					class="h-[150px] w-[150px] rounded-full bg-white object-cover"
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
				</p>
			</div>

			<button
				onclick={logout}
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
				{#if !!name && name !== data.user?.name}
					<button
						onclick={updateUser}
						type="submit"
						class="mt-2 rounded-md border border-blue-400 bg-blue-500 p-2 px-4 text-blue-50"
						>Submit Changes</button
					>
				{/if}
				<!-- profile pic -->
				<p class="text-lg">Profile Picture</p>
				<button
					onclick={() => {
						isUploadProfilePictureModalOpen = true;
					}}
					class="rounded-md border border-zinc-300 bg-zinc-200 p-2 px-4 text-zinc-500"
					><i class="bi bi-image mr-2"></i>Upload Profile Picture</button
				>
			</div>
		</div>
	</div>
</div>

<ModalUploadProfilePicture
	isOpen={isUploadProfilePictureModalOpen}
	closeModal={() => (isUploadProfilePictureModalOpen = false)}
/>

<style lang="postcss">
	input {
		@apply rounded-md border border-zinc-300 p-2 px-4 text-zinc-800;
	}

	input:disabled {
		@apply opacity-75;
	}
</style>
