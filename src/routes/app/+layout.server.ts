// import { getInitialLocale } from '$scripts/helpers';
// import { getCookie } from '$scripts/helpers';

export const load = async ({ url, locals }) => {

	return {
		url: url.pathname,
		user: locals.user,
		locale: locals.locale
	};
};
