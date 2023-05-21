<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';
	import type { PageData } from './$types';
	export let data: PageData;

	const logout = async () => {
		await fetch('/api/user/logout');
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
</script>

<div class="flex justify-center h-full">
	<div class="w-[90%] p-4 max-w-[1000px] flex sm:flex-row flex-col">
		<div class="flex flex-col items-center sm:items-start sm:w-fit p-2">
			<p
				class="bg-blue-600 text-blue-50 font-bold text-3xl w-[150px] h-[150px] rounded-full grid place-items-center"
			>
				{getUserInitials()}
			</p>
			<div>
				<p class="font-medium text-lg mt-2">{data.user?.name}</p>
				<p class="text-sm text-zinc-300 flex items-cetner">
					<span>{data.user?.email}</span>
					{#if data.user?.emailVerified}
						<i class="bi bi-envelope-check ml-2 translate-y-[1px]" />
					{/if}
				</p>
			</div>
			{#if !data.user?.emailVerified}
				<a
					href="/verify-email"
					class="mt-2 p-1 w-[200px] sm:w-full bg-blue-700 text-blue-50 border border-blue-500 text-sm rounded-md text-center"
					><i class="bi bi-envelope mr-2" />Verify Email</a
				>
			{/if}
			<button
				disabled={true}
				class="mt-2 p-1 w-[200px] sm:w-full bg-zinc-800 text-zinc-200 border border-zinc-700 text-sm rounded-md"
				><i class="bi bi-pencil-square mr-2" />Edit Profile</button
			>
			<button
				on:click={logout}
				class="mt-2 p-1 w-[200px] sm:w-full bg-red-600 text-red-50 border border-red-500 text-sm rounded-md"
				>Logout</button
			>
		</div>
		<div class="flex-1 px-2 flex flex-col overflow-y-auto">
			<div class="flex gap-2 text-zinc-500">
				<button class="text-zinc-200 underline">Uploaded Media</button>
				<button disabled={true}>Parental Controls</button>
				<button disabled={true}>Organization</button>
			</div>
		</div>
	</div>
</div>
