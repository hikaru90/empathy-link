// import { getInitialLocale } from '$scripts/helpers';
import { loadTranslations, locale } from '$lib/translations';
// import { getCookie } from '$scripts/helpers';

export const load = async ({ url, locals }) => {
	await loadTranslations(locals.locale, url.pathname);

	return {
		url: url.pathname,
		user: locals.user,
		locale: locals.locale
	};
};
