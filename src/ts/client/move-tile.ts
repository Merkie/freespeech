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
