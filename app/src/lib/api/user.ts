import { post } from './api.lib';

export const login = async (email: string, password: string) => {
	return await post('/api/user/authenticate', { email, password });
};

export const create_user = async (email: string, password: string) => {
	return await post('/api/user/create', { email, password });
};
