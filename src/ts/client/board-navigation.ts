import { pushState, replaceState } from '$app/navigation';

export const BOARD_NAVIGATION_EVENT = 'freespeech:board-navigation';

export type BoardNavigationDetail = {
	projectId: string;
	pageId: string;
};

export function navigateToBoardPage(
	projectId: string,
	pageId: string,
	options: { replace?: boolean } = {}
) {
	if (!projectId || !pageId) return;

	const detail = { projectId, pageId } satisfies BoardNavigationDetail;
	const url = `/app/project/${encodeURIComponent(projectId)}/${encodeURIComponent(pageId)}`;

	if (options.replace) {
		replaceState(url, { boardPageId: pageId });
	} else {
		pushState(url, { boardPageId: pageId });
	}

	window.dispatchEvent(new CustomEvent<BoardNavigationDetail>(BOARD_NAVIGATION_EVENT, { detail }));
}

export function parseBoardRoute(pathname: string): BoardNavigationDetail | null {
	const match = pathname.match(/^\/app\/project\/([^/]+)\/([^/]+)\/?$/);
	if (!match) return null;

	try {
		return {
			projectId: decodeURIComponent(match[1]),
			pageId: decodeURIComponent(match[2])
		};
	} catch {
		return null;
	}
}
