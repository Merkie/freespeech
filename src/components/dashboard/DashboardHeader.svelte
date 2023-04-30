<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';

	const logout = async () => {
		await fetch('/api/user/logout');
		$ActiveProject = null;
		window.location.assign('/');
	};
</script>

<div class="p-2 bg-zinc-900 text-zinc-100 flex item-center font-light gap-2 text-sm">
	<button>Projects</button>
	<button class="text-zinc-500">Uploaded Media</button>
	<div class="flex-1" />
	<button on:click={logout} class="bg-red-600 px-2 p-1 border border-red-500 rounded-md text-red-50"
		>Logout</button
	>
</div>
