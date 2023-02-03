export type Tile = {
	_id: string;
	text: string;
	x: number;
	y: number;
};
export type Page = {
	_id: string;
	name: string;
	tiles: Tile[];
};
export type Project = {
	name: string;
	description: string;
	columns: number;
	rows: number;
	image: string;
	private: boolean;
	userid: string;
	_id: string;
	pages: Page[];
};
export type User = {
	name: string;
	email: string;
	_id: string;
	projects: Project[];
};