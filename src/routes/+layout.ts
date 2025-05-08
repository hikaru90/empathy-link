import { loadTranslations } from '$lib/translations';
import { user } from '$store/auth';
import { get } from 'svelte/store';
import { pb } from '$scripts/pocketbase';
// export const prerender = true;

const originalConsoleError = console.error;
console.error = (...args) => {
	for (const arg of args) {
		if (arg instanceof Error) {
			const userId = get(user)?.id;
			originalConsoleError(arg.message);
			originalConsoleError(arg.stack);

			try{
				pb.collection('errors').create({
					message: arg.message,
					stack: arg.stack,
					user: userId
				});
			} catch (err) {
			}
		} else {
			originalConsoleError(arg);
		}
	}
};

export const load = async ({ url, data }) => {

	await loadTranslations(data.locale, url.pathname);
	if (data.user) user.set(data.user);
	else user.set(undefined);

	return {
		locale: data.locale,
		route: url.pathname,
		user: data.user
	};
};

