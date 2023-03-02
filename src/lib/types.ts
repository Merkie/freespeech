export type Tile = {
	_id: string;
	x: number;
	y: number;
	text: string;
	speakText?: string;
	image?: string;
	backgroundColor?: string;
	textColor?: string;
	borderColor?: string;
	modifier?: string;
	navigateTo?: string;
	isAccented?: boolean;
	userid: string;
	pageid: string;
};
export type Page = {
	_id: string;
	name: string;
	tiles: Tile[];
};
export type Project = {
	_id: string;
	name: string;
	description: string; // TBA
	private: boolean; // TBA
	columns: number;
	rows: number;
	slug: string;
	image: string;
	templates: {
		_id: string;
		name: string;
		parentPageId: string;
		tiles: { x: number; y: number }[];
	}[];
	pages: Page[];
	userid: string;
};
export type User = {
	name: string;
	email: string;
	_id: string;
	projects: Project[];
};

export type AppModes = 'home' | 'edit' | 'dashboard';

export type UserExpanded = User & {
	projects: (Project & {
		pages: (Page & {
			tiles: Tile[];
		})[];
	})[];
};

// export type Project = Project & {
// 	pages: (Page & {
// 		tiles: Tile[];
// 	})[];
// };
