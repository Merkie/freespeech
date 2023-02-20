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
	name: string;
	description: string; // TBA
	private: boolean; // TBA
	templates: {
		_id: string;
		name: string;
		parentPageId: string;
		tiles: { x: number; y: number }[];
	}[];
	columns: number;
	rows: number;
	image: string;
	userid: string;
	slug: string;
	_id: string;
	pages: Page[];
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
