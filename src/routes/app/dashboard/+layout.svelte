<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	const logout = async () => {
		await fetch('/api/user/logout');
		$ActiveProject = null;
		window.location.assign('/');
	};

	const links = [
		{
			name: 'Projects',
			path: '/app/dashboard/projects'
		},
		{
			name: 'Application Settings',
			path: '/app/dashboard/settings'
		},
		{
			name: 'Uploaded Media',
			path: '/app/dashboard/media'
		}
	];
</script>

<div class="p-2 bg-zinc-900 text-zinc-100 flex items-center font-light gap-2 text-sm">
	{#each links as link}
		<a href={link.path} class={data.path.startsWith(link.path) ? '' : 'text-zinc-500'}
			>{link.name}</a
		>
	{/each}
	<div class="flex-1" />
	<button on:click={logout} class="bg-red-600 px-2 p-1 border border-red-500 rounded-md text-red-50"
		>Logout</button
	>
</div>
<div class="flex-1 flex flex-col bg-zinc-800 p-2 font-light text-zinc-100">
	<slot><!-- optional fallback --></slot>
</div>
