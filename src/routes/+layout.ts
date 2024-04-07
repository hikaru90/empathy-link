import { loadTranslations } from '$lib/translations';

export const load = async({ url }) => {
  const initLocale = 'en'; // get from cookie, user session, ...
  await loadTranslations(initLocale, url.pathname); // keep this just before the `return`

	return {
		url: url.pathname
	};
}