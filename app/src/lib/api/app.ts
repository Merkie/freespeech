import { post, get } from './api.lib';
import type { Tile } from '@prisma/client';

export const create_project = async (name: string, description: string, access_token: string) => {
	return await post('/api/app/project/create', { name, description }, access_token);
};

export const add_tile = async (page_id: number, access_token: string) => {
	return await post('/api/app/tile/add', { page_id }, access_token);
};

export const update_tiles = async (updates: Array<Tile>, access_token: string) => {
	return await post('/api/app/tile/update_batch', { updates }, access_token);
};
