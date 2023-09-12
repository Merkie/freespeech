<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';
	import type { PageData } from './$types';
	export let data: PageData;

	let profileInput: HTMLInputElement;

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
</script>

<div class="flex h-full justify-center">
	<div class="flex w-[90%] max-w-[1000px] flex-col p-4 sm:flex-row">
		<div class="flex flex-col items-center p-2 sm:w-fit sm:items-start">
			<p
				class="grid h-[150px] w-[150px] place-items-center rounded-full bg-blue-600 text-3xl font-bold text-blue-50"
			>
				{getUserInitials()}
			</p>
			<div>
				<p class="mt-2 text-lg font-medium">{data.user?.name}</p>
				<p class="items-cetner flex text-sm">
					<span>{data.user?.email}</span>
					{#if data.user?.emailVerified}
						<i class="bi bi-envelope-check ml-2 translate-y-[1px]" />
					{/if}
				</p>
			</div>
			<!-- {#if !data.user?.emailVerified}
				<a
					href="/verify-email"
					class="mt-2 w-[200px] rounded-md border border-blue-500 bg-blue-700 p-1 text-center text-sm text-blue-50 sm:w-full"
					><i class="bi bi-envelope mr-2" />Verify Email</a
				>
			{/if} -->

			<button
				on:click={logout}
				class="mt-2 w-[200px] rounded-md border border-red-500 bg-red-600 p-1 text-sm text-red-50 sm:w-full"
				>Logout</button
			>
		</div>
		<div class="flex flex-1 flex-col overflow-y-auto px-2">
			<form class="flex flex-col gap-2">
				<label class="text-lg" for="email">Email</label>
				<input type="text" name="email" value={data.user?.email} disabled={true} />
				<label class="text-lg" for="name">Name</label>
				<input type="text" name="name" value={data.user?.name} />
				<!-- profile pic -->
				<label class="text-lg" for="profile">Profile Picture</label>
				<button
					on:click={(e) => {
						e.preventDefault();
						profileInput.click();
					}}
					class="rounded-md border border-zinc-300 bg-zinc-200 p-2 px-4 text-zinc-500"
					><i class="bi bi-image mr-2" />Upload Profile Picture</button
				>
				<input bind:this={profileInput} type="file" name="profile" class="hidden" />
				<button
					disabled={true}
					type="submit"
					class="mt-2 rounded-md border border-blue-500 bg-blue-600 p-2 px-4 text-blue-50"
					>Submit Changes</button
				>
			</form>
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
