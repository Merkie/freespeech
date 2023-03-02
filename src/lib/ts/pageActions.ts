import { CurrentProject } from '$lib/stores';
import type { Page, Project, Tile } from '$lib/types';
import { createId } from '@paralleldrive/cuid2';

let currentProjectValue: Project | null = null;
CurrentProject.subscribe((value) => {
	currentProjectValue = value;
});

export function createPage({ pageName }: { pageName: string }) {
	if (!currentProjectValue) return;
	CurrentProject.set({
		...currentProjectValue,
		pages: [
			...currentProjectValue.pages,
			{
				_id: createId(),
				name: pageName.toLowerCase(),
				tiles: [
					{
						_id: createId(),
						text: 'New Tile',
						x: 0,
						y: 0
					}
				]
			} as Page & { tiles: Tile[] }
		]
	});
}
