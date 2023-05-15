<script lang="ts">
	import { ActiveProject } from '$ts/client/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let visible = false;
	let containerHeight: number;

	onMount(() => {
		visible = true;
	});

	const links = [
		{
			name: 'Your Projects',
			path: '/app/dashboard/projects'
		},
		{
			name: 'Application Settings',
			path: '/app/dashboard/settings'
		},
		{
			name: 'Uploaded Media',
			path: '/app/dashboard/media'
		},
		{
			name: 'Your Profile',
			path: '/app/dashboard/profile',
			hidden: true
		}
	];

	const getUserInitials = () => {
		const name = data.user?.name;
		if (!name) return '';
		const names = name.split(' ');
		if (names.length === 1) return names[0].charAt(0);
		return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
	};
</script>

<!-- webpage title -->
<svelte:head>
	<title>{links.find((link) => link.path.startsWith($page.url.pathname))?.name} - Dashboard</title>
</svelte:head>

<!-- dashboard header -->
<div class="p-2 bg-zinc-900 text-zinc-100 flex items-center font-light gap-2 text-sm">
	{#each links as link}
		{#if !link.hidden}
			<a
				href={link.path}
				class={`${
					$page.url.pathname.startsWith(link.path) ? '' : 'text-zinc-500'
				} transition-colors`}>{link.name}</a
			>
		{/if}
	{/each}
	<div class="flex-1" />
	<a href="/app/dashboard/profile">
		<p
			class="bg-blue-600 text-blue-50 font-bold text-xs grid place-items-center w-[35px] h-[35px] rounded-full"
		>
			{getUserInitials()}
		</p>
	</a>
</div>

<!-- main content container -->
<div class="flex-1 flex flex-col bg-zinc-800 p-2 font-light text-zinc-100">
	<!-- dashboard page title -->
	<div class="flex items-center">
		{#key $page.url.pathname}
			<p in:fly={{ x: -20 }} class="text-3xl">
				{links.find((link) => link.path.startsWith($page.url.pathname))?.name}:
			</p>
		{/key}
	</div>
	<!-- page content container -->
	<div bind:clientHeight={containerHeight} class="flex-1 relative mt-2 flex flex-col">
		<!-- inner absolutely positioned container -->
		<!-- this is done to force the y overflow to not intrude on the rest of the app ui -->
		{#if containerHeight}
			<div
				class="absolute w-full bg-zinc-900 rounded-md border border-zinc-700"
				style={`height: ${containerHeight}px; max-height: ${containerHeight}px; overflow-y: auto;`}
			>
				<slot><!-- optional fallback --></slot>
			</div>
		{/if}
	</div>
</div>
