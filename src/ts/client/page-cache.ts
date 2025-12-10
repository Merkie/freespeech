import type { TilePage, Project } from '$ts/common/types';
import { CurrentPageData } from '$ts/client/stores';
import { get } from 'svelte/store';
import api from '$ts/client/api';

export type CachedPageData = {
	page: TilePage;
	project: Project;
	isHomePage: boolean;
	cachedAt: number;
};

type CacheEntry = {
	key: string;
	data: CachedPageData;
	accessedAt: number;
};

const DB_NAME = 'freespeech-page-cache';
const STORE_NAME = 'pages';
const DB_VERSION = 1;
const MAX_CACHE_BYTES = 2 * 1024 * 1024; // 2MB

let dbPromise: Promise<IDBDatabase> | null = null;

// In-memory cache for instant access to pages visited this session
const memoryCache = new Map<string, CachedPageData>();

/**
 * Get page from memory cache (synchronous, instant)
 */
export function getMemoryCachedPage(projectId: string, pageId: string): CachedPageData | null {
	const key = `${projectId}:${pageId}`;
	return memoryCache.get(key) || null;
}

/**
 * Set page in memory cache
 */
function setMemoryCache(projectId: string, pageId: string, data: CachedPageData): void {
	const key = `${projectId}:${pageId}`;
	memoryCache.set(key, data);
}

/**
 * Invalidate page from memory cache
 */
function invalidateMemoryCache(projectId: string, pageId: string): void {
	const key = `${projectId}:${pageId}`;
	memoryCache.delete(key);
}

/**
 * Clear all memory cache
 */
export function clearMemoryCache(): void {
	memoryCache.clear();
}

function openDB(): Promise<IDBDatabase> {
	if (dbPromise) return dbPromise;

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'key' });
			}
		};
	});

	return dbPromise;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} bytes`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function getCachedPage(
	projectId: string,
	pageId: string
): Promise<CachedPageData | null> {
	// Check memory cache first (instant)
	const memoryCached = getMemoryCachedPage(projectId, pageId);
	if (memoryCached) {
		return memoryCached;
	}

	// Fall back to IndexedDB
	try {
		const db = await openDB();
		const key = `${projectId}:${pageId}`;

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(key);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const entry = request.result as CacheEntry | undefined;
				if (entry) {
					// Update access time
					entry.accessedAt = Date.now();
					store.put(entry);
					// Also store in memory cache for instant access next time
					setMemoryCache(projectId, pageId, entry.data);
					resolve(entry.data);
				} else {
					resolve(null);
				}
			};
		});
	} catch (error) {
		console.error('Failed to read from page cache:', error);
		return null;
	}
}

function getEntrySize(entry: CacheEntry): number {
	return new Blob([JSON.stringify(entry.data)]).size;
}

export async function setCachedPage(
	projectId: string,
	pageId: string,
	data: CachedPageData
): Promise<void> {
	// Always update memory cache immediately
	setMemoryCache(projectId, pageId, data);

	try {
		const db = await openDB();
		const key = `${projectId}:${pageId}`;

		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		// Get all entries to check cache size
		const allEntriesRequest = store.getAll();

		allEntriesRequest.onsuccess = () => {
			const entries = allEntriesRequest.result as CacheEntry[];
			const newEntrySize = new Blob([JSON.stringify(data)]).size;

			// Calculate current cache size (excluding the entry we're updating if it exists)
			const existingEntryIndex = entries.findIndex((e) => e.key === key);
			let currentSize = entries.reduce((sum, entry, index) => {
				if (index === existingEntryIndex) return sum; // Don't count the one we're replacing
				return sum + getEntrySize(entry);
			}, 0);

			// If adding this entry would exceed the limit, evict oldest pages until we have room
			if (currentSize + newEntrySize > MAX_CACHE_BYTES) {
				// Sort by accessedAt (oldest first), excluding the entry we're updating
				const evictionCandidates = entries
					.filter((e) => e.key !== key)
					.sort((a, b) => a.accessedAt - b.accessedAt);

				let evictedCount = 0;
				while (currentSize + newEntrySize > MAX_CACHE_BYTES && evictionCandidates.length > 0) {
					const toEvict = evictionCandidates.shift()!;
					const evictedSize = getEntrySize(toEvict);
					store.delete(toEvict.key);
					currentSize -= evictedSize;
					evictedCount++;
					console.log(`[PageCache] Evicted page: ${toEvict.key} (${formatBytes(evictedSize)})`);
				}

				if (evictedCount > 0) {
					console.log(`[PageCache] Evicted ${evictedCount} page(s) to make room`);
				}
			}

			// Add/update the new entry
			const entry: CacheEntry = {
				key,
				data,
				accessedAt: Date.now()
			};

			store.put(entry);

			// Calculate new total size for logging
			const newTotalSize = currentSize + newEntrySize;
			const pageCount = existingEntryIndex >= 0 ? entries.length : entries.length + 1;
			console.log(
				`[PageCache] Cached ${pageCount} pages (${formatBytes(newTotalSize)} / ${formatBytes(MAX_CACHE_BYTES)}) - wrote ${formatBytes(newEntrySize)}`
			);
		};
	} catch (error) {
		console.error('Failed to write to page cache:', error);
	}
}

export async function invalidateCachedPage(projectId: string, pageId: string): Promise<void> {
	// Always invalidate memory cache immediately
	invalidateMemoryCache(projectId, pageId);

	try {
		const db = await openDB();
		const key = `${projectId}:${pageId}`;

		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		store.delete(key);

		console.log(`[PageCache] Invalidated page: ${key}`);
	} catch (error) {
		console.error('Failed to invalidate page cache:', error);
	}
}

export async function invalidateProjectPages(projectId: string): Promise<void> {
	try {
		const db = await openDB();
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const allEntriesRequest = store.getAll();

		allEntriesRequest.onsuccess = () => {
			const entries = allEntriesRequest.result as CacheEntry[];
			let invalidatedCount = 0;

			for (const entry of entries) {
				if (entry.key.startsWith(`${projectId}:`)) {
					store.delete(entry.key);
					invalidatedCount++;
				}
			}

			if (invalidatedCount > 0) {
				console.log(`[PageCache] Invalidated ${invalidatedCount} pages for project: ${projectId}`);
			}
		};
	} catch (error) {
		console.error('Failed to invalidate project pages:', error);
	}
}

export async function clearPageCache(): Promise<void> {
	try {
		const db = await openDB();
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		store.clear();
		console.log('[PageCache] Cleared all cached pages');
	} catch (error) {
		console.error('Failed to clear page cache:', error);
	}
}

/**
 * Refreshes the current page data by fetching from API and updating the store.
 * Also invalidates the cache for the current page.
 * This replaces invalidateAll() for page-related components.
 */
export async function refreshCurrentPage(): Promise<void> {
	const currentData = get(CurrentPageData);
	if (!currentData) return;

	const projectId = currentData.project.id;
	const pageId = currentData.page.id;

	// Invalidate cache first
	await invalidateCachedPage(projectId, pageId);

	try {
		const { page: projectPage, isHomePage, error } = await api.project.viewPage(projectId, pageId);

		if (error || !projectPage || !projectPage.tilePage || !projectPage.project) {
			console.error('Failed to refresh page data');
			return;
		}

		// Update cache
		await setCachedPage(projectId, pageId, {
			page: projectPage.tilePage,
			project: projectPage.project,
			isHomePage,
			cachedAt: Date.now()
		});

		// Update store, preserving projectPages if they were already loaded
		CurrentPageData.set({
			page: projectPage.tilePage,
			project: projectPage.project,
			isHomePage,
			projectPages: currentData.projectPages || []
		});
	} catch (error) {
		console.error('Failed to refresh current page:', error);
	}
}

/**
 * Refreshes the project pages list (used when pages are created/edited/deleted).
 * This updates the projectPages in the store.
 */
export async function refreshProjectPages(): Promise<void> {
	const currentData = get(CurrentPageData);
	if (!currentData) return;

	const projectId = currentData.project.id;

	try {
		const { project } = await api.project.view(projectId);
		if (project?.connectedPages) {
			CurrentPageData.set({
				...currentData,
				projectPages: project.connectedPages.map((p) => p.tilePage!)
			});
		}
	} catch (error) {
		console.error('Failed to refresh project pages:', error);
	}
}
