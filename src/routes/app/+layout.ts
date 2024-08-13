import { loadTranslations } from '$lib/translations';
import { user } from '$store/auth';

// export const prerender = true;

export const load = async ({ url, data }) => {

	await loadTranslations(data.locale, url.pathname);
	if (data.user) user.set(data.user);
	else user.set(undefined);

	console.log('layout.ts values - locals:',data );
	console.log('layout.ts values - user:',data.user );

	return {
		locale: data.locale,
		route: url.pathname,
		user: data.user
	};
};

