/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;

const to_cache = build.concat(files);
const staticAssets = new Set(to_cache); // /static

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(FILES)
			.then((cache) => cache.addAll(to_cache))
			.then(() => {
				worker.skipWaiting();
			})
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== FILES) await caches.delete(key);
			}

			worker.clients.claim();
		})
	);
});

async function fetchAndCache(request: Request) {
	const cache = await caches.open(`offline${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;

		throw err;
	}
}

worker.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);

	// don't try to handle e.g. data: URIs
	const isHttp = url.protocol.startsWith('http');
	const isDevServerRequest =
		url.hostname === self.location.hostname && url.port !== self.location.port;
	const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
	const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;

	if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
		event.respondWith(
			(async () => {
				// always serve static files and bundler-generated assets from cache.
				// if your application has other URLs with data that will never change,
				// set this variable to true for them and they will only be fetched once.
				const cachedAsset = isStaticAsset && (await caches.match(event.request));

				return cachedAsset || fetchAndCache(event.request);
			})()
		);
	}
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	// Prevents the default mini-infobar or install dialog from appearing on mobile
	e.preventDefault();
	// Save the event because you'll need to trigger it later.
	deferredPrompt = e;
	// Show your customized install prompt for your PWA
	// Your own UI doesn't have to be a single element, you
	// can have buttons in different locations, or wait to prompt
	// as part of a critical journey.
	// showInAppInstallPromotion();
});
