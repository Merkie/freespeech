<script lang="ts">
	// stores
	import {
		TileBeingEdited,
		EditingTiles,
		LocalSettings,
		UsingOnlineSearch,
		Sentence,
		ProjectPages,
		ProjectPagesLoading,
		BoardRefreshVersion
	} from '$ts/client/stores';
	// components
	import PageHeader from '~/routes/app/project/[projectId]/[pageId]/_components/PageHeader.svelte';
	import SentenceBuilder from '$components/app/SentenceBuilder.svelte';
	import TilePage from '$components/app/TilePage.svelte';
	import Loader from '$components/common/Loader.svelte';
	import type { Tile } from '$ts/common/types';
	import EditTilePanel from '$components/modals/EditTilePanel.svelte';
	import OnlineImageSearchPanel from '$components/modals/OnlineImageSearchPanel.svelte';
	import EditPagesModal from '$components/modals/EditPagesModal.svelte';
	import EditPageModal from '$components/modals/EditPageModal.svelte';
	import CreatePageModal from '$components/modals/CreatePageModal.svelte';
	import UnsavedChangesModal from '$components/modals/UnsavedChangesModal.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page as route } from '$app/stores';
	import api from '$ts/client/api';
	import {
		boardPageDataEqual,
		deleteCachedBoardPage,
		readCachedBoardPage,
		writeCachedBoardPage,
		type BoardPageData
	} from '$ts/client/board-page-cache';

	export let data;

	let boardData: BoardPageData | null = null;
	let containerHeight: number; // Needed for CSS tricks
	let mounted = false;
	let loading = true;
	let activeRouteKey = '';
	let activeRequestKey = '';
	let prefetchedRouteKey = '';
	let observedRefreshVersion = 0;

	$: projectId = ($route.params.projectId as string) || data.projectId || '';
	$: pageId = ($route.params.pageId as string) || '';

	$: organizedTiles = (() => {
		if (!boardData) return [] as Tile[][];

		const newTiles = boardData.page.tiles!.reduce((acc: Tile[][], tile: Tile) => {
			acc[tile.page] = acc[tile.page] || [];
			acc[tile.page].push(tile);

			return acc;
		}, []) as Tile[][];

		if ($EditingTiles) newTiles.push([]);

		return newTiles;
	})();

	function syncTokenFromCookie() {
		const tokenCookie = document.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('token='))
			?.split('=')[1];

		if (tokenCookie) {
			window.localStorage.setItem('token', decodeURIComponent(tokenCookie));
		}
	}

	function trackVisit(nextData: BoardPageData) {
		$LocalSettings = {
			...$LocalSettings,
			lastVisitedProjectId: nextData.projectId,
			lastVisitedPageId: nextData.page.id,
			lastVisitedHomePageId: nextData.project.homePageId ?? ''
		};
	}

	function setBoardData(nextData: BoardPageData | null) {
		boardData = nextData;
		if (nextData) trackVisit(nextData);
	}

	async function loadBoardPage(
		nextProjectId: string,
		nextPageId: string,
		options: { force?: boolean } = {}
	) {
		if (!mounted || !nextProjectId || !nextPageId) return;

		const routeKey = `${nextProjectId}:${nextPageId}`;
		if (!options.force && routeKey === activeRouteKey) return;

		if (!options.force) {
			activeRouteKey = routeKey;
			prefetchedRouteKey = '';
			$ProjectPages = [];
			$Sentence = [];

			const cachedData = readCachedBoardPage({ projectId: nextProjectId, pageId: nextPageId });
			setBoardData(boardPageDataEqual(boardData, cachedData) ? boardData : cachedData);
			loading = !cachedData;
		} else {
			loading = !boardData;
		}

		activeRequestKey = routeKey;

		try {
			const { page: projectPage, isHomePage } = await api.project.viewPage(nextProjectId, nextPageId);
			if (activeRequestKey !== routeKey) return;

			if (!projectPage || !projectPage.tilePage || !projectPage.project) {
				deleteCachedBoardPage({ projectId: nextProjectId, pageId: nextPageId });
				await goto('/app/dashboard/projects', { replaceState: true });
				return;
			}

			const freshData: BoardPageData = {
				page: projectPage.tilePage,
				project: projectPage.project,
				projectId: nextProjectId,
				isHomePage
			};

			writeCachedBoardPage({ projectId: nextProjectId, pageId: nextPageId }, freshData);
			setBoardData(boardPageDataEqual(boardData, freshData) ? boardData : freshData);
			loading = false;
		} catch {
			if (activeRequestKey === routeKey && !boardData) {
				await goto('/app/dashboard/projects', { replaceState: true });
			}
		}
	}

	function getLinkedPageIds(nextData: BoardPageData) {
		return [
			...new Set(
				nextData.page.tiles
					.map((tile) => tile.navigation)
					.filter((navigation) => navigation && navigation !== nextData.page.id)
			)
		];
	}

	function prefetchLinkedPages(nextData: BoardPageData) {
		for (const linkedPageId of getLinkedPageIds(nextData)) {
			const cacheParams = { projectId: nextData.project.id, pageId: linkedPageId };
			if (readCachedBoardPage(cacheParams)) continue;

			void api.project
				.viewPage(nextData.project.id, linkedPageId)
				.then(({ page: projectPage, isHomePage }) => {
					if (!projectPage?.tilePage || !projectPage.project) return;
					writeCachedBoardPage(cacheParams, {
						page: projectPage.tilePage,
						project: projectPage.project,
						projectId: nextData.project.id,
						isHomePage
					});
				})
				.catch(() => {
					// Prefetch is opportunistic; normal navigation still fetches on demand.
				});
		}
	}

	// Fetch project pages when entering edit mode
	async function fetchProjectPages() {
		if (!boardData || $ProjectPages.length > 0 || $ProjectPagesLoading) return;
		$ProjectPagesLoading = true;
		try {
			const { pages } = await api.project.listPages(boardData.project.id);
			$ProjectPages = pages;
		} finally {
			$ProjectPagesLoading = false;
		}
	}

	$: if (mounted && projectId && pageId) {
		void loadBoardPage(projectId, pageId);
	}

	$: if (mounted && $EditingTiles) {
		void fetchProjectPages();
	}

	$: if (mounted && $BoardRefreshVersion !== observedRefreshVersion) {
		observedRefreshVersion = $BoardRefreshVersion;
		if (projectId && pageId) void loadBoardPage(projectId, pageId, { force: true });
	}

	$: if (mounted && boardData && activeRouteKey && prefetchedRouteKey !== activeRouteKey) {
		prefetchedRouteKey = activeRouteKey;
		prefetchLinkedPages(boardData);
	}

	onMount(() => {
		mounted = true;
		observedRefreshVersion = $BoardRefreshVersion;
		syncTokenFromCookie();
		void loadBoardPage(projectId, pageId);

		return () => {
			mounted = false;
		};
	});
</script>

<svelte:head>
	{#if boardData}
		<title>{`${$EditingTiles ? 'Editing:' : ''} ${boardData.page.name} | FreeSpeechAAC`}</title>
	{/if}
</svelte:head>

{#if !boardData && loading}
	<Loader />
{:else if boardData}
	<PageHeader page={boardData.page} />

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
						columns={boardData.project.columns}
						rows={boardData.project.rows}
						projectId={boardData.project.id}
						pageId={boardData.page.id}
						isHomePage={boardData.isHomePage}
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
						pages={$ProjectPages}
						tiles={boardData.page.tiles}
						projectId={boardData.project.id}
						isHomePage={boardData.isHomePage}
					/>
				{/if}
			</div>
		{/if}
	</div>

	<EditPagesModal projectId={boardData.project.id} pages={$ProjectPages} />
	<CreatePageModal projectId={boardData.project.id} />
	<EditPageModal />
	<UnsavedChangesModal />
{/if}
