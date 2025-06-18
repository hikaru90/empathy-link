import { user } from '$store/auth';

// export const prerender = true;

export const load = async ({ url, data }) => {

	if (data.user) user.set(data.user);
	else user.set(undefined);

	return {
		locale: data.locale,
		route: url.pathname,
		user: data.user
	};
};

