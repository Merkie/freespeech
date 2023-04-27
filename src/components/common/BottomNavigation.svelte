<script lang="ts">
	import { ActivePage, ActiveProject, AppMode } from '$ts/client/stores';
	export let noProjects: boolean;

	const handleSwitchToHome = async () => {
		if ($AppMode === 'edit') {
			const response = await fetch('/api/project/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: $ActiveProject?.id,
					pageName: $ActivePage,
					data: $ActiveProject?.pages.find((page) => page.name === $ActivePage)?.data
				})
			});
			console.log(await response.json());
		}
		$ActivePage = 'Home';
		$AppMode = 'home';
	};
</script>

<div
	class="bg-zinc-900 text-zinc-100 font-light p-2 flex gap-2 border border-x-0 border-b-0 border-zinc-700"
>
	<button
		on:click={handleSwitchToHome}
		class={$AppMode === 'home' ? 'bg-zinc-800' : ''}
		disabled={noProjects}>Home</button
	>
	<button
		on:click={() => ($AppMode = 'edit')}
		class={$AppMode === 'edit' ? 'bg-zinc-800' : ''}
		disabled={noProjects}>Edit</button
	>
	<button
		on:click={() => ($AppMode = 'dashboard')}
		class={$AppMode === 'dashboard' ? 'bg-zinc-800' : ''}>Dashboard</button
	>
</div>

<style lang="postcss">
	button {
		@apply p-1 flex-1 rounded-md;
	}
</style>
