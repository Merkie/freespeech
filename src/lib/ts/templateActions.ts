import { CurrentProject } from '$lib/stores';
import type { Project } from '$lib/types';
import { createId } from '@paralleldrive/cuid2';

let currentProjectValue: Project | null = null;
CurrentProject.subscribe((value) => {
	currentProjectValue = value;
});

export function createTemplate({ templateName }: { templateName: string }) {
	if (!currentProjectValue) return;
	CurrentProject.set({
		...currentProjectValue,
		templates: [
			...currentProjectValue.templates,
			{
				_id: createId(),
				parentPageId:
					currentProjectValue.pages.find(
						(page) => page.name.toLowerCase() === templateName.toLowerCase()
					)?._id || '',
				name: templateName,
				tiles: []
			}
		]
	});
}
