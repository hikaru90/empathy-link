import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	
	if (!user) {
		redirect(302, '/app/auth/login');
	}
	
	if (user.role !== 'admin') {
		redirect(302, '/bullshift');
	}
	
	return {
		user
	};
};