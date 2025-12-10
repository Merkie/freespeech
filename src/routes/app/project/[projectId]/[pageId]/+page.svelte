<script lang="ts">
	// stores
	import {
		TileBeingEdited,
		EditingTiles,
		LocalSettings,
		UsingOnlineSearch,
		Sentence,
		CurrentPageData,
		PageDataLoading,
		ProjectPagesLoading
	} from '$ts/client/stores';
	// components
	import PageHeader from '~/routes/app/project/[projectId]/[pageId]/_components/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import type { Tile, TilePage as TilePageType } from '$ts/common/types';
	import EditTilePanel from '$components/modals/EditTilePanel.svelte';
	import OnlineImageSearchPanel from '$components/modals/OnlineImageSearchPanel.svelte';
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import EditPageModal from '$components/modals/EditPageModal.svelte';
	import CreatePageModal from '$components/modals/CreatePageModal.svelte';
	import UnsavedChangesModal from '$components/modals/UnsavedChangesModal.svelte';
	import PageSkeleton from '$components/app/PageSkeleton.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import api from '$ts/client/api';
	import { getCachedPage, setCachedPage, getMemoryCachedPage } from '$ts/client/page-cache';

	export let data: { projectId: string; pageId: string };

	let containerHeight: number;
	let lastLoadedKey = '';
	let projectPagesLoadedForProject = '';
	let mounted = false;

	$: organizedTiles = (() => {
		if (!$CurrentPageData) return [];

		const newTiles = $CurrentPageData.page.tiles!.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		if ($EditingTiles) newTiles.push([]);

		return newTiles;
	})();

	async function loadPageData(projectId: string, pageId: string) {
		const key = `${projectId}:${pageId}`;
		if (lastLoadedKey === key) return; // Already loading/loaded this page
		lastLoadedKey = key;

		// Check memory cache first (synchronous, instant)
		const memoryCached = getMemoryCachedPage(projectId, pageId);
		if (memoryCached) {
			$CurrentPageData = {
				page: memoryCached.page,
				project: memoryCached.project,
				isHomePage: memoryCached.isHomePage,
				projectPages: [] // Will be loaded on-demand when editing
			};
			$PageDataLoading = false;

			// Fetch fresh data in background to update cache
			fetchAndCachePage(projectId, pageId, true);
			return;
		}

		// Clear previous page data and show skeleton
		$CurrentPageData = null;
		$PageDataLoading = true;

		try {
			// Check IndexedDB cache
			const cached = await getCachedPage(projectId, pageId);
			if (cached) {
				$CurrentPageData = {
					page: cached.page,
					project: cached.project,
					isHomePage: cached.isHomePage,
					projectPages: [] // Will be loaded on-demand when editing
				};
				$PageDataLoading = false;

				// Fetch fresh data in background to update cache
				fetchAndCachePage(projectId, pageId, true);
				return;
			}

			// No cache, fetch from API
			await fetchAndCachePage(projectId, pageId, false);
		} catch (error) {
			console.error('Failed to load page data:', error);
			goto('/app/dashboard/projects');
		}
	}

	function hasPageDataChanged(
		current: typeof $CurrentPageData,
		newPage: TilePageType,
		newProject: typeof $CurrentPageData extends null ? never : NonNullable<typeof $CurrentPageData>['project'],
		newIsHomePage: boolean
	): boolean {
		if (!current) return true;

		// Compare isHomePage
		if (current.isHomePage !== newIsHomePage) return true;

		// Compare page properties
		if (current.page.id !== newPage.id || current.page.name !== newPage.name) return true;

		// Compare project properties
		if (
			current.project.id !== newProject.id ||
			current.project.columns !== newProject.columns ||
			current.project.rows !== newProject.rows
		) return true;

		// Compare tiles (the most likely thing to change)
		const currentTiles = current.page.tiles || [];
		const newTiles = newPage.tiles || [];

		if (currentTiles.length !== newTiles.length) return true;

		// Sort both arrays by id for consistent comparison
		const sortedCurrent = [...currentTiles].sort((a, b) => a.id.localeCompare(b.id));
		const sortedNew = [...newTiles].sort((a, b) => a.id.localeCompare(b.id));

		for (let i = 0; i < sortedCurrent.length; i++) {
			const c = sortedCurrent[i];
			const n = sortedNew[i];
			if (
				c.id !== n.id ||
				c.text !== n.text ||
				c.displayText !== n.displayText ||
				c.image !== n.image ||
				c.backgroundColor !== n.backgroundColor ||
				c.borderColor !== n.borderColor ||
				c.navigation !== n.navigation ||
				c.x !== n.x ||
				c.y !== n.y ||
				c.page !== n.page
			) {
				return true;
			}
		}

		return false;
	}

	async function fetchAndCachePage(projectId: string, pageId: string, isBackgroundRefresh: boolean) {
		try {
			const { page: projectPage, isHomePage, error } = await api.project.viewPage(projectId, pageId);

			if (error || !projectPage || !projectPage.tilePage || !projectPage.project) {
				if (!isBackgroundRefresh) {
					goto('/app/dashboard/projects');
				}
				return;
			}

			// Cache the page data (without projectPages since that's loaded separately)
			await setCachedPage(projectId, pageId, {
				page: projectPage.tilePage,
				project: projectPage.project,
				isHomePage,
				cachedAt: Date.now()
			});

			// Check if data has changed before updating UI
			const dataChanged = hasPageDataChanged(
				$CurrentPageData,
				projectPage.tilePage,
				projectPage.project,
				isHomePage
			);

			if (!isBackgroundRefresh || dataChanged) {
				if (isBackgroundRefresh && dataChanged) {
					console.log('[PageCache] Background refresh detected changes, updating UI');
				}

				$CurrentPageData = {
					page: projectPage.tilePage,
					project: projectPage.project,
					isHomePage,
					projectPages: $CurrentPageData?.projectPages || []
				};
			}
		} finally {
			if (!isBackgroundRefresh) {
				$PageDataLoading = false;
			}
		}
	}

	async function loadProjectPages(projectId: string) {
		if (projectPagesLoadedForProject === projectId) return; // Already loaded for this project
		if ($CurrentPageData?.projectPages && $CurrentPageData.projectPages.length > 0) {
			projectPagesLoadedForProject = projectId;
			return; // Already have pages
		}

		projectPagesLoadedForProject = projectId;
		$ProjectPagesLoading = true;
		try {
			const { project } = await api.project.view(projectId);
			if (project?.connectedPages && $CurrentPageData) {
				$CurrentPageData = {
					...$CurrentPageData,
					projectPages: project.connectedPages.map((p) => p.tilePage!)
				};
			}
		} catch (error) {
			console.error('Failed to load project pages:', error);
			projectPagesLoadedForProject = ''; // Reset on error to allow retry
		} finally {
			$ProjectPagesLoading = false;
		}
	}

	// Load project pages when entering edit mode
	$: if (browser && $EditingTiles && data.projectId && $CurrentPageData) {
		loadProjectPages(data.projectId);
	}

	// Reload data when route params change (only on client)
	$: if (browser && mounted && data.projectId && data.pageId) {
		loadPageData(data.projectId, data.pageId);
	}

	onMount(() => {
		mounted = true;
		if (data.projectId) $LocalSettings.lastVisitedProjectId = data.projectId;
		$Sentence = [];
		// Trigger initial load
		loadPageData(data.projectId, data.pageId);
	});

	onDestroy(() => {
		// Clear current page data when leaving
		$CurrentPageData = null;
		$EditingTiles = false;
		$TileBeingEdited = null;
		$UsingOnlineSearch = false;
	});
</script>

<svelte:head>
	{#if $CurrentPageData}
		<title>{`${$EditingTiles ? 'Editing:' : ''} ${$CurrentPageData.page.name} | FreeSpeechAAC`}</title>
	{:else}
		<title>Loading... | FreeSpeechAAC</title>
	{/if}
</svelte:head>

{#if $PageDataLoading && !$CurrentPageData}
	<PageSkeleton />
{:else if $CurrentPageData}
	<PageHeader page={$CurrentPageData.page} />

	{#if !$EditingTiles && $LocalSettings.sentenceBuilder}<SentenceBuilder />{/if}

	<div bind:clientHeight={containerHeight} class="relative flex-1 bg-zinc-100">
		<div
			class="absolute overflow-auto"
			style={`height: ${containerHeight}px; width: ${
				$TileBeingEdited ? 'calc(100% - 350px)' : '100%'
			};`}
		>
			{#if containerHeight}
				{#each organizedTiles as pageTiles, pageIndex}
					<TilePage
						{containerHeight}
						subpage={pageIndex}
						tiles={pageTiles}
						columns={$CurrentPageData.project.columns}
						rows={$CurrentPageData.project.rows}
						projectId={$CurrentPageData.project.id}
						pageId={$CurrentPageData.page.id}
						isHomePage={$CurrentPageData.isHomePage}
					/>
				{/each}
			{/if}
		</div>
		{#if $TileBeingEdited}
			<div
				class="absolute right-0 top-0 flex w-[350px] flex-col overflow-y-auto border border-zinc-800 bg-zinc-900 p-4 text-zinc-200 shadow-md"
				style={`height: ${containerHeight}px;`}
			>
				{#if $UsingOnlineSearch}
					<OnlineImageSearchPanel />
				{:else}
					<EditTilePanel
						pages={$CurrentPageData.projectPages}
						tiles={$CurrentPageData.page.tiles}
						projectId={$CurrentPageData.project.id}
						isHomePage={$CurrentPageData.isHomePage}
					/>
				{/if}
			</div>
		{/if}
	</div>

	{#if $CurrentPageData.project}
		<EditPagesModal projectId={$CurrentPageData.project.id} pages={$CurrentPageData.projectPages} />
		<CreatePageModal projectId={$CurrentPageData.project.id} />
		<EditPageModal />
		<UnsavedChangesModal />
	{/if}
{/if}
