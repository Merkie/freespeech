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

export type LocalSettings = {
	offlineVoice: string;
	elevenLabsVoice: IElevenLabsVoice;
	voiceGenerator: IVoiceGenerator;
	speakOnTap: boolean;
	sentenceBuilder: boolean;
	skinTone: SkinTone;
	lastVisitedProjectId: string;
};

export type SkinTone = 'dark' | 'medium-dark' | 'medium' | 'medium-light' | 'light';

export type User = {
	id: string;
	email: string;
	name: string;
	password: string | null;
	profileImgUrl: string | null;
	elevenLabsApiKey: string | null;
	usePersonalElevenLabsKey: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type Project = {
	id: string;

	user: User;
	userId: string;

	connectedPages: TilePageInProject[];

	name: string;
	description: string | null;
	imageUrl: string | null;
	columns: number;
	rows: number;
	isPublic: boolean;

	createdAt: Date;
	updatedAt: Date;
};

export type TilePage = {
	id: string;

	tiles: Tile[];
	connectedProjects: TilePageInProject[];

	user: User;
	userId: string;

	name: string;
	isPublic: boolean;

	createdAt: Date;
	updatedAt: Date;
};

export type TilePageInProject = {
	id: string;

	tilePage: TilePage;
	tilePageId: string;

	project: Project;
	projectId: string;

	createdAt: Date;
	updatedAt: Date;
};

export type Tile = {
	id: string;

	TilePage: TilePage;
	tilePageId: string;

	x: number;
	y: number;
	page: number;
	text: string;
	backgroundColor: string;
	borderColor: string;
	image: string;
	navigation: string;
	displayText: string;

	createdAt: Date;
	updatedAt: Date;
};

export type MarketPlaceTilePage = {
	id: string;

	tilePage: TilePage;
	tilePageId: string;

	name: string;
	description: string | null;
	imageUrl: string | null;
	isPublic: boolean;

	createdAt: Date;
	updatedAt: Date;
};
