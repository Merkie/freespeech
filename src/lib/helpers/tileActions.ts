import { CurrentProject } from '$lib/stores';
import type { Tile, Project } from '$lib/types';
import { createId } from '@paralleldrive/cuid2';

let currentProjectValue: Project | null = null;
CurrentProject.subscribe((value) => {
	currentProjectValue = value;
});

// Update Tile based on id
export function updateTile({
	tilePage,
	tileId,
	newTile
}: {
	tilePage: string;
	tileId: string;
	newTile: Tile;
}) {
	if (!currentProjectValue) return;
	CurrentProject.set({
		...currentProjectValue,
		pages: currentProjectValue.pages.map((page) => {
			if (page.name !== tilePage) return page;
			return {
				...page,
				tiles: page.tiles.map((tile) => {
					if (tile._id !== tileId) return tile;
					return newTile;
				})
			};
		})
	});
}

// Add tile to page
export function addTile({ tilePage, x, y }: { tilePage: string; x: number; y: number }) {
	if (!currentProjectValue) return;
	CurrentProject.set({
		...currentProjectValue,
		pages: currentProjectValue.pages.map((page) => {
			if (page.name !== tilePage) return page;
			return {
				...page,
				tiles: [
					...page.tiles,
					{
						_id: createId(),
						x,
						y,
						text: 'New Tile',
						speakText: null,
						image: null,
						backgroundColor: null,
						textColor: null,
						borderColor: null,
						modifier: null,
						navigateTo: null,
						isAccented: false,
						userid: currentProjectValue?.userid,
						pageId: page._id
					} as unknown as Tile
				]
			};
		})
	});
}
