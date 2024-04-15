// import { getInitialLocale } from '$scripts/helpers';
import { loadTranslations, locale } from '$lib/translations';
// import { getCookie } from '$scripts/helpers';

export const load = async ({ url, locals }) => {
	// console.log('locals layout.server.ts', locals);
	// const initLocale = getInitialLocale();

	await loadTranslations(locals.locale, url.pathname);

	return {
		url: url.pathname,
		user: locals.user,
		locale: locals.locale
	};
};
