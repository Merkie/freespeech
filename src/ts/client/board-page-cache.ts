import { browser } from '$app/environment';
import type { Project, TilePage } from '$ts/common/types';

const CACHE_VERSION = 1;
const CACHE_PREFIX = `boardPageCache:v${CACHE_VERSION}`;

type BoardPageCacheParams = {
	projectId: string;
	pageId: string;
};

export type BoardPageData = {
	page: TilePage;
	project: Project;
	projectId: string;
	isHomePage: boolean;
};

type BoardPageCacheEntry = {
	version: number;
	cachedAt: number;
	data: BoardPageData;
};

function getTokenScope() {
	if (!browser) return 'server';

	const token = localStorage.getItem('token') || '';
	let hash = 0;

	for (let index = 0; index < token.length; index += 1) {
		hash = (hash << 5) - hash + token.charCodeAt(index);
		hash |= 0;
	}

	return Math.abs(hash).toString(36) || 'anon';
}

function getCacheKey({ projectId, pageId }: BoardPageCacheParams) {
	return `${CACHE_PREFIX}:${getTokenScope()}:${projectId}:${pageId}`;
}

function isBoardPageData(value: unknown): value is BoardPageData {
	if (!value || typeof value !== 'object') return false;

	const data = value as BoardPageData;
	return (
		typeof data.isHomePage === 'boolean' &&
		typeof data.projectId === 'string' &&
		typeof data.page?.id === 'string' &&
		typeof data.project?.id === 'string'
	);
}

export function readCachedBoardPage(params: BoardPageCacheParams): BoardPageData | null {
	if (!browser) return null;

	try {
		const raw = localStorage.getItem(getCacheKey(params));
		if (!raw) return null;

		const entry = JSON.parse(raw) as Partial<BoardPageCacheEntry>;
		if (entry.version !== CACHE_VERSION || !isBoardPageData(entry.data)) return null;
		if (entry.data.page.id !== params.pageId || entry.data.project.id !== params.projectId) {
			return null;
		}

		return entry.data;
	} catch {
		return null;
	}
}

export function writeCachedBoardPage(params: BoardPageCacheParams, data: BoardPageData) {
	if (!browser) return;

	try {
		const entry: BoardPageCacheEntry = {
			version: CACHE_VERSION,
			cachedAt: Date.now(),
			data
		};

		localStorage.setItem(getCacheKey(params), JSON.stringify(entry));
	} catch {
		// Cache writes are best-effort; rendering should never depend on storage quota.
	}
}

export function deleteCachedBoardPage(params: BoardPageCacheParams) {
	if (!browser) return;

	try {
		localStorage.removeItem(getCacheKey(params));
	} catch {
		// Ignore storage failures.
	}
}

export function boardPageDataEqual(
	first: BoardPageData | null | undefined,
	second: BoardPageData | null | undefined
) {
	if (!first || !second) return first === second;

	try {
		return JSON.stringify(first) === JSON.stringify(second);
	} catch {
		return false;
	}
}
