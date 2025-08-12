import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		// No server-side data needed for this page
	};
};
