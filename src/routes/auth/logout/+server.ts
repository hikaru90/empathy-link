import type { PageServerLoad, Actions } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { user } from '$store/auth';

export const POST = ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = undefined
	throw redirect(303, '/');
};
