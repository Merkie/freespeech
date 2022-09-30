import { auth } from '$lib/lucia';
import { getSession } from 'lucia-sveltekit/load';

export const load = auth.handleServerSession();
