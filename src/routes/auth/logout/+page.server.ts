import type { PageServerLoad, Actions } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { user } from '$store/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.baseToken) locals.pb.authStore.clear();
	throw redirect(303, '/');
};
