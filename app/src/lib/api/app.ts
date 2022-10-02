import { post, get } from './api.lib';
import type { Tile, TilePage } from '@prisma/client';

export const fetch_project = async (project_id: string, access_token: string) => {
	return await post(`/api/app/project/fetch`, { project_id }, access_token);
};

export const create_project = async (name: string, description: string, access_token: string) => {
	return await post('/api/app/project/create', { name, description }, access_token);
};

export const create_page = async (project_id: string, name: string, access_token: string) => {
	return await post('/api/app/page/create', { project_id, name }, access_token);
};

export const reorder_page = async (page_id: number, new_items: Tile[], access_token: string) => {
	return await post('/api/app/page/reorder', { page_id, new_items }, access_token);
};

export const edit_page = async (page: TilePage, access_token: string) => {
	return await post('/api/app/page/edit', { page }, access_token);
};

export const create_tile = async (page_id: number, tile: Tile, access_token: string) => {
	return await post('/api/app/tile/create', { page_id, tile }, access_token);
};

export const edit_tile = async (tile: Tile, access_token: string) => {
	return await post('/api/app/tile/edit', { tile }, access_token);
};

export const update_tiles = async (updates: Array<Tile>, access_token: string) => {
	return await post('/api/app/tile/update_batch', { updates }, access_token);
};
