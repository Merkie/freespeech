/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

const PRECACHE_PREFIX = 'freespeech-precache-';
const PRECACHE = `${PRECACHE_PREFIX}${version}`;
const OFFLINE_CACHE = 'freespeech-offline-v1';
const META_CACHE = 'freespeech-meta-v1';

const OFFLINE_SHELL_URL = '/__freespeech_offline_shell__';
const OFFLINE_START_URL = '/__freespeech_offline_start__';
const PRECACHE_HISTORY_URL = '/__freespeech_precache_history__';
const BOARD_ROUTE = /^\/app\/project\/[^/]+\/[^/]+\/?$/;
const PRECACHED_PATHS = new Set(
	[...build, ...files].map((path) => new URL(path, worker.location.origin).pathname)
);

type WorkerMessage =
	| { type: 'CACHE_APP_SHELL'; url: string }
	| { type: 'CACHE_URLS'; urls: string[] }
	| { type: 'SET_OFFLINE_START'; url: string }
	| { type: 'CLEAR_OFFLINE_DATA' };

type CacheResult = {
	cached: number;
	failed: number;
};

worker.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(PRECACHE);
			await cache.addAll([...build, ...files]);
			await worker.skipWaiting();
		})()
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			await retainCurrentAndPreviousPrecaches();
			await worker.clients.claim();
		})()
	);
});

worker.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);

	if (request.mode === 'navigate') {
		event.respondWith(handleNavigation(request));
		return;
	}

	if (
		(url.origin === worker.location.origin && PRECACHED_PATHS.has(url.pathname)) ||
		request.destination === 'image' ||
		request.destination === 'style' ||
		request.destination === 'font' ||
		request.destination === 'script'
	) {
		event.respondWith(handleCacheableAsset(request));
	}
});

worker.addEventListener('message', (event) => {
	const message = event.data as WorkerMessage | undefined;
	if (!message?.type) return;

	event.waitUntil(
		(async () => {
			try {
				switch (message.type) {
					case 'CACHE_APP_SHELL': {
						const url = normalizeBoardUrl(message.url);
						if (!url) throw new Error('Invalid board URL');

						await cacheAppShell(url);
						postMessageResult(event, { cached: 1, failed: 0 });
						break;
					}
					case 'CACHE_URLS': {
						const result = await cacheUrls(message.urls);
						postMessageResult(event, result);
						break;
					}
					case 'SET_OFFLINE_START': {
						const url = normalizeBoardUrl(message.url);
						if (!url) throw new Error('Invalid board URL');

						await saveOfflineStart(url);
						postMessageResult(event, { cached: 1, failed: 0 });
						break;
					}
					case 'CLEAR_OFFLINE_DATA': {
						await caches.delete(OFFLINE_CACHE);
						postMessageResult(event, { cached: 0, failed: 0 });
						break;
					}
				}
			} catch (error) {
				postMessageResult(event, {
					cached: 0,
					failed: 1,
					error: error instanceof Error ? error.message : 'Offline cache operation failed'
				});
			}
		})()
	);
});

async function retainCurrentAndPreviousPrecaches() {
	const meta = await caches.open(META_CACHE);
	const historyResponse = await meta.match(PRECACHE_HISTORY_URL);
	const previousHistory = historyResponse ? ((await historyResponse.json()) as string[]) : [];
	const history = [...previousHistory.filter((name) => name !== PRECACHE), PRECACHE].slice(-2);

	await meta.put(
		PRECACHE_HISTORY_URL,
		new Response(JSON.stringify(history), { headers: { 'Content-Type': 'application/json' } })
	);

	const cacheNames = await caches.keys();
	await Promise.all(
		cacheNames
			.filter((name) => name.startsWith(PRECACHE_PREFIX) && !history.includes(name))
			.map((name) => caches.delete(name))
	);
}

async function handleNavigation(request: Request) {
	try {
		const response = await fetchWithTimeout(request, 5000);
		if (response.ok && !response.redirected) {
			const cache = await caches.open(OFFLINE_CACHE);
			await cache.put(request, response.clone());

			const url = new URL(request.url);
			if (BOARD_ROUTE.test(url.pathname)) {
				await cache.put(OFFLINE_SHELL_URL, response.clone());
				await saveOfflineStart(url.pathname);
			}
		}

		return response;
	} catch {
		const cache = await caches.open(OFFLINE_CACHE);
		const url = new URL(request.url);

		if (url.pathname === '/app' || url.pathname === '/app/') {
			const offlineStart = await readOfflineStart();
			if (offlineStart)
				return Response.redirect(new URL(offlineStart, worker.location.origin), 302);
		}

		const exact = await cache.match(request, { ignoreSearch: true });
		if (exact) return exact;

		if (url.pathname.startsWith('/app')) {
			const shell = await cache.match(OFFLINE_SHELL_URL);
			if (shell) return shell;
		}

		return new Response(
			'FreeSpeech is offline and this screen has not been downloaded yet. Reconnect and open your communication board once to prepare it.',
			{
				status: 503,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			}
		);
	}
}

async function handleCacheableAsset(request: Request) {
	const currentPrecache = await caches.open(PRECACHE);
	const precached = await currentPrecache.match(request, { ignoreSearch: false });
	if (precached) return precached;

	const offlineCache = await caches.open(OFFLINE_CACHE);
	const cached = await offlineCache.match(request, { ignoreSearch: false });
	if (cached) return cached;

	const response = await fetch(request);
	if (canCache(response)) await offlineCache.put(request, response.clone());
	return response;
}

async function cacheAppShell(pathname: string) {
	const request = new Request(new URL(pathname, worker.location.origin), {
		credentials: 'include',
		cache: 'reload'
	});
	const response = await fetch(request);

	if (!response.ok || response.redirected) {
		throw new Error(`Unable to download the app shell (${response.status})`);
	}

	const cache = await caches.open(OFFLINE_CACHE);
	await Promise.all([
		cache.put(request, response.clone()),
		cache.put(OFFLINE_SHELL_URL, response.clone()),
		saveOfflineStart(pathname)
	]);
}

async function cacheUrls(urls: string[]): Promise<CacheResult> {
	const cache = await caches.open(OFFLINE_CACHE);
	const uniqueUrls = [...new Set(urls)].filter(Boolean);
	let cached = 0;
	let failed = 0;

	for (const url of uniqueUrls) {
		try {
			const absoluteUrl = new URL(url, worker.location.origin);
			const sameOrigin = absoluteUrl.origin === worker.location.origin;
			const request = new Request(absoluteUrl, {
				mode: sameOrigin ? 'same-origin' : 'no-cors',
				credentials: sameOrigin ? 'include' : 'omit'
			});

			const existing = await cache.match(request);
			if (!existing) {
				const response = await fetch(request);
				if (!canCache(response)) throw new Error(`Unable to cache ${absoluteUrl.href}`);
				await cache.put(request, response.clone());
			}

			cached += 1;
		} catch {
			failed += 1;
		}
	}

	return { cached, failed };
}

async function saveOfflineStart(pathname: string) {
	const normalized = normalizeBoardUrl(pathname);
	if (!normalized) return;

	const cache = await caches.open(OFFLINE_CACHE);
	await cache.put(
		OFFLINE_START_URL,
		new Response(normalized, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
	);
}

async function readOfflineStart() {
	const cache = await caches.open(OFFLINE_CACHE);
	const response = await cache.match(OFFLINE_START_URL);
	return response ? response.text() : null;
}

function normalizeBoardUrl(url: string) {
	try {
		const parsed = new URL(url, worker.location.origin);
		if (parsed.origin !== worker.location.origin || !BOARD_ROUTE.test(parsed.pathname)) return null;
		return parsed.pathname;
	} catch {
		return null;
	}
}

function canCache(response: Response) {
	return response.ok || response.type === 'opaque';
}

async function fetchWithTimeout(request: Request, timeoutMs: number) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(request, { signal: controller.signal });
	} finally {
		clearTimeout(timeout);
	}
}

function postMessageResult(
	event: ExtendableMessageEvent,
	result: CacheResult & { error?: string }
) {
	event.ports[0]?.postMessage(result);
}
