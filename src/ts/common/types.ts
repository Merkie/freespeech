import type { Project, TilePage as PrismaPage } from '@prisma/client';

export type Tile = {
	x: number;
	y: number;
	text: string;
	displayText?: string;
	image?: string;
	navigation?: string;
	page?: number;
	color?: string;
};

export type TilePage = PrismaPage & {
	data: {
		tiles: Tile[];
	};
};

export type FullProject = Project & {
	pages: TilePage[];
};

export type IVoiceGenerator = 'elevenlabs' | 'offline';
export type IElevenLabsVoice =
	| 'Rachel'
	| 'Domi'
	| 'Bella'
	| 'Antoni'
	| 'Elli'
	| 'Josh'
	| 'Arnold'
	| 'Adam'
	| 'Sam';
export type ILocalSettings = {
	offlineVoice: string;
	elevenLabsVoice: IElevenLabsVoice;
	voiceGenerator: IVoiceGenerator;
	speakOnTap: boolean;
	sentenceBuilder: boolean;
};
export type IModal = {
	name:
		| 'edit-pages'
		| 'edit-page'
		| 'create-page'
		| 'edit-tile'
		| 'search-online-images'
		| 'create-project'
		| 'manage-projects'
		| 'crop-image'
		| 'edit-project'
		| '';
	key?: string;
	props?: any;
};
