import { browser } from '$app/environment';
import api from '$ts/client/api';
import {
	getBoardCacheScope,
	writeCachedBoardPage,
	type BoardPageData
} from '$ts/client/board-page-cache';
import { NetworkOnline, OfflineCacheStatus } from '$ts/client/stores';

const READY_CACHE_PREFIX = 'offlineBoardReady:v1';
const SHARED_OFFLINE_URLS = [
	'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css',
	'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/fonts/bootstrap-icons.woff2?7141511ac37f13e1a387fb9fc6646256',
	'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/fonts/bootstrap-icons.woff?7141511ac37f13e1a387fb9fc6646256'
];

type WorkerResult = {
	cached: number;
	failed: number;
	error?: string;
};

type OfflineReadyRecord = {
	cachedAt: number;
	pageCount: number;
	imageCount: number;
	partial: boolean;
};

const preparationPromises = new Map<string, Promise<void>>();
let initialized = false;

export function initializeOfflineSupport() {
	if (!browser || initialized) return;
	initialized = true;

	const updateNetworkState = () => {
		NetworkOnline.set(navigator.onLine);
		if (!navigator.onLine) {
			OfflineCacheStatus.update((status) => ({
				...status,
				phase: 'offline',
				message: 'Offline',
				detail: status.projectId
					? 'Using the downloaded copy of this communication board.'
					: 'Open a downloaded communication board to use it offline.'
			}));
		} else {
			OfflineCacheStatus.update((status) =>
				status.phase === 'offline'
					? {
							...status,
							phase: status.projectId ? 'ready' : 'idle',
							message: status.projectId ? 'Available offline' : 'Preparing offline access',
							detail: status.projectId ? 'This board has a downloaded offline copy.' : undefined
						}
					: status
			);
		}
	};

	window.addEventListener('online', updateNetworkState);
	window.addEventListener('offline', updateNetworkState);
	updateNetworkState();

	void requestPersistentStorage();
	void cacheSharedOfflineAssets().catch(() => {
		// The project-specific preparation will surface meaningful failures to the user.
	});
}

export function prepareProjectForOffline(
	initialData: BoardPageData,
	options: { force?: boolean } = {}
) {
	if (!browser || !navigator.onLine) {
		markCachedProjectActive(initialData.projectId, true);
		return Promise.resolve();
	}

	const { projectId } = initialData;
	if (options.force) preparationPromises.delete(projectId);

	const existing = preparationPromises.get(projectId);
	if (existing) return existing;

	const preparation = downloadProject(initialData).catch((error) => {
		preparationPromises.delete(projectId);
		OfflineCacheStatus.set({
			phase: 'error',
			message: 'Offline setup needs internet',
			detail:
				error instanceof Error
					? error.message
					: 'Keep this board open while connected and FreeSpeech will try again.',
			projectId
		});
	});

	preparationPromises.set(projectId, preparation);
	return preparation;
}

export function rememberBoardForOffline(projectId: string, pageId: string) {
	if (!browser || !projectId || !pageId || !('serviceWorker' in navigator)) return;

	void postToWorker({
		type: 'SET_OFFLINE_START',
		url: `/app/project/${encodeURIComponent(projectId)}/${encodeURIComponent(pageId)}`
	}).catch(() => {
		// The app can still use the current in-memory board if the worker is not ready yet.
	});
}

export function markCachedProjectActive(projectId: string, hasCachedPage: boolean) {
	if (!browser) return;

	const record = readReadyRecord(projectId);
	if (!navigator.onLine) {
		OfflineCacheStatus.set({
			phase: 'offline',
			message: 'Offline',
			detail: hasCachedPage
				? record?.partial
					? 'Using cached board data. Some images or pages may not have finished downloading.'
					: 'Using the downloaded copy of this communication board.'
				: 'This page was not downloaded before the connection was lost.',
			projectId
		});
		return;
	}

	if (record) {
		OfflineCacheStatus.set({
			phase: record.partial ? 'partial' : 'ready',
			message: record.partial ? 'Offline copy incomplete' : 'Available offline',
			detail: record.partial
				? 'Keep this board open while connected so missing pages or images can finish downloading.'
				: `${record.pageCount} page${record.pageCount === 1 ? '' : 's'} and ${record.imageCount} image${record.imageCount === 1 ? '' : 's'} downloaded.`,
			projectId
		});
	}
}

async function downloadProject(initialData: BoardPageData) {
	const { projectId } = initialData;
	OfflineCacheStatus.set({
		phase: 'preparing',
		message: 'Saving for offline use…',
		detail: 'Downloading the application and every page in this board.',
		projectId
	});

	const boardUrl = `/app/project/${encodeURIComponent(projectId)}/${encodeURIComponent(initialData.page.id)}`;
	const shellResult = await postToWorker({ type: 'CACHE_APP_SHELL', url: boardUrl });
	if (shellResult.failed)
		throw new Error(shellResult.error || 'The application shell could not be saved.');

	const { pages } = await api.project.listPages(projectId);
	const pageIds = [...new Set([initialData.page.id, ...pages.map((page) => page.id)])];
	const downloadedPages: BoardPageData[] = [];
	let failedPages = 0;

	for (let index = 0; index < pageIds.length; index += 4) {
		const batch = pageIds.slice(index, index + 4);
		OfflineCacheStatus.set({
			phase: 'preparing',
			message: `Saving pages ${index + 1}–${Math.min(index + batch.length, pageIds.length)} of ${pageIds.length}…`,
			detail: 'You can keep using the board while this finishes.',
			projectId
		});

		const results = await Promise.allSettled(
			batch.map(async (pageId) => {
				if (pageId === initialData.page.id) return initialData;

				const { page, isHomePage } = await api.project.viewPage(projectId, pageId);
				if (!page?.tilePage || !page.project) throw new Error(`Page ${pageId} was unavailable`);

				return {
					page: page.tilePage,
					project: page.project,
					projectId,
					isHomePage
				} satisfies BoardPageData;
			})
		);

		for (const result of results) {
			if (result.status === 'fulfilled') {
				downloadedPages.push(result.value);
				writeCachedBoardPage({ projectId, pageId: result.value.page.id }, result.value);
			} else {
				failedPages += 1;
			}
		}
	}

	const imageUrls = [
		...new Set(
			downloadedPages.flatMap(({ page }) => page.tiles.map((tile) => tile.image).filter(Boolean))
		)
	];

	OfflineCacheStatus.set({
		phase: 'preparing',
		message: imageUrls.length
			? `Saving ${imageUrls.length} board image${imageUrls.length === 1 ? '' : 's'}…`
			: 'Finishing offline setup…',
		detail: 'The downloaded copy is stored on this device.',
		projectId
	});

	const imageResult = await postToWorker({ type: 'CACHE_URLS', urls: imageUrls });
	const partial = failedPages > 0 || imageResult.failed > 0;
	const record: OfflineReadyRecord = {
		cachedAt: Date.now(),
		pageCount: downloadedPages.length,
		imageCount: imageResult.cached,
		partial
	};
	localStorage.setItem(getReadyCacheKey(projectId), JSON.stringify(record));

	OfflineCacheStatus.set({
		phase: partial ? 'partial' : 'ready',
		message: partial ? 'Offline copy incomplete' : 'Available offline',
		detail: partial
			? `${failedPages} page${failedPages === 1 ? '' : 's'} and ${imageResult.failed} image${imageResult.failed === 1 ? '' : 's'} could not be saved. FreeSpeech will retry while this board is open online.`
			: `${record.pageCount} page${record.pageCount === 1 ? '' : 's'} and ${record.imageCount} image${record.imageCount === 1 ? '' : 's'} downloaded.`,
		projectId
	});
}

async function cacheSharedOfflineAssets() {
	if (!('serviceWorker' in navigator)) return;
	await postToWorker({ type: 'CACHE_URLS', urls: SHARED_OFFLINE_URLS });
}

async function requestPersistentStorage() {
	if (!navigator.storage?.persist) return;
	try {
		await navigator.storage.persist();
	} catch {
		// Persistent storage is an optimization; service-worker caching still works without it.
	}
}

async function postToWorker(message: unknown): Promise<WorkerResult> {
	if (!('serviceWorker' in navigator)) {
		throw new Error('Offline storage is not supported by this browser.');
	}

	const registration = await navigator.serviceWorker.ready;
	const serviceWorker = registration.active || registration.waiting || registration.installing;
	if (!serviceWorker) throw new Error('The offline worker is not ready yet.');

	return new Promise<WorkerResult>((resolve, reject) => {
		const channel = new MessageChannel();
		const timeout = window.setTimeout(
			() => reject(new Error('Offline storage timed out.')),
			120_000
		);

		channel.port1.onmessage = (event: MessageEvent<WorkerResult>) => {
			window.clearTimeout(timeout);
			if (event.data.error) reject(new Error(event.data.error));
			else resolve(event.data);
		};

		serviceWorker.postMessage(message, [channel.port2]);
	});
}

function getReadyCacheKey(projectId: string) {
	return `${READY_CACHE_PREFIX}:${getBoardCacheScope()}:${projectId}`;
}

function readReadyRecord(projectId: string): OfflineReadyRecord | null {
	try {
		const raw = localStorage.getItem(getReadyCacheKey(projectId));
		return raw ? (JSON.parse(raw) as OfflineReadyRecord) : null;
	} catch {
		return null;
	}
}
