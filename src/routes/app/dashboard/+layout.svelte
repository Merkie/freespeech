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
			icon: 'grid',
			path: '/app/dashboard/projects'
		},
		{
			name: 'Application Settings',
			icon: 'sliders',
			path: '/app/dashboard/settings'
		},
		// {
		// 	name: 'Uploaded Media',
		// 	path: '/app/dashboard/media'
		// },
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
<div class="flex items-center gap-2 bg-zinc-900 p-2 text-sm font-light text-zinc-100">
	{#each links as link}
		{#if !link.hidden}
			<a
				href={link.path}
				class={`${
					$page.url.pathname.startsWith(link.path)
						? 'border-zinc-700'
						: 'border-zinc-900 text-zinc-500'
				} rounded-md border p-2 py-1 transition-colors`}
				><i class={`bi bi-${link.icon} mr-2`} />{link.name}</a
			>
		{/if}
	{/each}
	<div class="flex-1" />
	<a href="/app/dashboard/profile">
		{#if data.user.profileImgUrl}
			<img src={data.user.profileImgUrl} alt="profile" class="h-[35px] w-[35px] rounded-full" />
		{:else}
			<p
				class="grid h-[35px] w-[35px] place-items-center rounded-full bg-blue-500 text-xs font-bold text-blue-50"
			>
				{getUserInitials()}
			</p>
		{/if}
	</a>
</div>

<!-- main content container -->
<div class="flex flex-1 flex-col bg-zinc-100">
	<!-- page content container -->
	<div bind:clientHeight={containerHeight} class="relative flex flex-1 flex-col">
		<!-- inner absolutely positioned container -->
		<!-- this is done to force the y overflow to not intrude on the rest of the app ui -->
		{#if containerHeight}
			<div
				class="absolute w-full"
				style={`height: ${containerHeight}px; max-height: ${containerHeight}px; overflow-y: auto;`}
			>
				<slot><!-- optional fallback --></slot>
			</div>
		{/if}
	</div>
</div>
