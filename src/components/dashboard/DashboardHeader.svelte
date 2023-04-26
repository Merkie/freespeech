<script lang="ts">
	const logout = async () => {
		await fetch('/api/user/logout');
		window.location.assign('/');
	};
</script>

<div class="p-2 bg-zinc-900 flex item-center font-light">
	<div class="flex-1" />
	<button
		on:click={logout}
		class="bg-red-600 px-2 p-1 border border-red-500 rounded-md text-red-50 text-sm">Logout</button
	>
</div>
