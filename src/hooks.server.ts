import { locale, loadTranslations } from '$lib/translations';
import { v4 as uuidv4 } from 'uuid';
import { serializeNonPOJOs } from '$scripts/helpers';
import { pb } from '$scripts/pocketbase'
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';
const client = 'empathy_link'


export const handle: Handle = async ({ event, resolve }) => {
	let sessionToken = event.cookies.get(`${client}_session_id`);
	let posthogUserId = event.cookies.get(`${client}_user_id`);
	if (!sessionToken) {
		sessionToken = uuidv4();
		event.cookies.set(`${client}_session_id`, sessionToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});
	}
	if (!posthogUserId) {
		posthogUserId = uuidv4();
		event.cookies.set(`${client}_user_id`, posthogUserId, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7 * 52 // 1 year
		});
	}
	// Retrieve PostHog cookie
	const phCookieString: string | undefined = event.cookies.get(`ph_${PUBLIC_POSTHOG_KEY}_posthog`);
	const phCookie: { distinct_id: string } | undefined = phCookieString ? JSON.parse(phCookieString) : undefined;
	const posthogId = phCookie ? phCookie.distinct_id : posthogUserId;

	event.locals.posthogId = posthogId;
	event.locals.sessionToken = sessionToken;
	event.locals.userId = posthogUserId;

	console.log('hooks server handle');
	const localeCookie = event.cookies.get('locale');
	const langHeaders = event.request.headers.get('accept-language')?.split(',')[0].split('-')[0];

	console.log('hooks:localeCookie', localeCookie);

	if (localeCookie) {
		event.locals.locale = localeCookie
		// locale.set(localeCookie);
	}
	else if (langHeaders) {
		event.locals.locale = langHeaders
		// locale.set(langHeaders);
	}

	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// Verify the token is valid
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}

		// Check if this is an API route
		if (event.url.pathname.startsWith('/api')) {
			// If not authenticated and trying to access API, throw 401
			if (!event.locals.pb.authStore.isValid) {
				throw redirect(303, '/app/auth/login');
			}
		}

		// Set the user in the locals object
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model) as App.User;
		const user = event.locals.pb.authStore.baseModel;
		// initUserSession(user, messages, userId);

		// Update the cookie
		const response = await resolve(event);
		response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

		return response;
	} catch (error) {
		// Clear the cookie on any error
		event.locals.pb.authStore.clear();

		if (event.url.pathname.startsWith('/api')) {
			throw redirect(303, '/login');
		}

		const response = await resolve(event);
		response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
		return response;
	}
};
