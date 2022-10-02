import { post } from './api.lib';

export const login = async (email: string, password: string) => {
	return await post('/api/user/authenticate', { email, password });
};

export const create_user = async (email: string, password: string) => {
	return await post('/api/user/create', { email, password });
};

export const edit_user = async (user: any, access_token: string) => {
	return await post('/api/user/edit', { user }, access_token);
};
