import { invalidateAll } from '$app/navigation';
import api from '$ts/client/api';
import { requestBoardRefresh } from '$ts/client/stores';
import type { Tile } from '$ts/common/types';

/**
 * Moves a tile to a target cell (x, y, subpage) within the board.
 *
 * - If the target cell is empty, the source tile is simply repositioned.
 * - If the target cell is occupied by another tile, the two tiles swap places.
 *
 * Persists the change(s) via the tile edit endpoint, then refreshes the board
 * the same way the rest of the editor does (thumbnail + invalidate + refresh).
 */
export async function moveTile({
	source,
	targetX,
	targetY,
	targetPage,
	occupant,
	projectId,
	isHomePage
}: {
	source: Tile | null;
	targetX: number;
	targetY: number;
	targetPage: number;
	occupant: Tile | null;
	projectId: string;
	isHomePage: boolean;
}) {
	if (!source) return;

	// Dropping a tile onto its own cell is a no-op.
	if (source.x === targetX && source.y === targetY && source.page === targetPage) return;

	// Dropping onto itself (occupant is the source) is also a no-op.
	if (occupant && occupant.id === source.id) return;

	if (occupant) {
		// Swap: the occupant takes the source's old cell.
		await api.tile.edit(occupant.id, {
			...occupant,
			x: source.x,
			y: source.y,
			page: source.page
		});
	}

	// Source moves into the target cell.
	await api.tile.edit(source.id, {
		...source,
		x: targetX,
		y: targetY,
		page: targetPage
	});

	if (isHomePage) void api.project.updateThumbnail(projectId);
	await invalidateAll();
	requestBoardRefresh();
}

/**
 * Finds the next available cell on a page, scanning right-to-left across each
 * row, top-to-bottom through the rows, then overflowing onto further subpages.
 */
export function findNextAvailableSlot(
	tiles: Tile[],
	columns: number,
	rows: number
): { x: number; y: number; page: number } {
	const occupied = new Set(tiles.map((tile) => `${tile.page}:${tile.x}:${tile.y}`));
	const maxPage = tiles.reduce((max, tile) => Math.max(max, tile.page), 0);

	// maxPage + 1 guarantees an empty subpage exists as a fallback.
	for (let page = 0; page <= maxPage + 1; page++) {
		for (let y = 0; y < rows; y++) {
			for (let x = columns - 1; x >= 0; x--) {
				if (!occupied.has(`${page}:${x}:${y}`)) return { x, y, page };
			}
		}
	}

	return { x: columns - 1, y: 0, page: maxPage + 1 };
}

/**
 * Moves a tile INTO a folder — i.e. reassigns it to the folder's linked page
 * (the folder tile's `navigation`) and drops it into that page's next free
 * slot. Used by the "Add" half of the folder drop overlay.
 */
export async function addTileToFolder({
	source,
	folderPageId,
	projectId,
	isHomePage
}: {
	source: Tile | null;
	folderPageId: string;
	projectId: string;
	isHomePage: boolean;
}) {
	if (!source || !folderPageId) return;

	// Fetch the destination page's current tiles + grid dimensions so we can
	// pick a non-colliding slot.
	const { page } = await api.project.viewPage(projectId, folderPageId);
	const targetTiles = page?.tilePage?.tiles ?? [];
	const columns = page?.project?.columns ?? 1;
	const rows = page?.project?.rows ?? 1;

	const slot = findNextAvailableSlot(targetTiles, columns, rows);

	await api.tile.edit(source.id, {
		...source,
		tilePageId: folderPageId,
		x: slot.x,
		y: slot.y,
		page: slot.page
	});

	if (isHomePage) void api.project.updateThumbnail(projectId);
	await invalidateAll();
	requestBoardRefresh();
}
