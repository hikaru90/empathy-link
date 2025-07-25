import { v4 as uuidv4 } from 'uuid';
import { serializeNonPOJOs } from '$scripts/helpers';
import { pb } from '$scripts/pocketbase'
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$src/paraglide/server';


const client = 'empathy_link'

const first: Handle = async ({ event, resolve }) => {
	if (
		event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')
	) {
		return new Response(null, { status: 204 });
	}

	// Get session token and posthog user id
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
	//end posthog integration

	// Initialize PocketBase instance for this request
	event.locals.pb = pb;

	// Load authentication state from cookies
	const cookieHeader = event.request.headers.get('cookie') || '';
	event.locals.pb.authStore.loadFromCookie(cookieHeader);

	// Track authentication state before refresh attempt
	const wasAuthenticated = event.locals.pb.authStore.isValid;

	try {
		// Attempt to refresh token if we have a valid auth state
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			console.log('Token refresh successful');
		}
	} catch (err) {
		const error = err as { status?: number; message?: string };
		console.log('Token refresh failed:', error.message || 'Unknown error');

		// Only clear auth store if the error indicates invalid/expired token
		if (error.status === 401 || error.status === 403) {
			console.log('Clearing auth store due to invalid token');
			event.locals.pb.authStore.clear();
		} else {
			// For other errors (network issues, etc.), keep the auth state
			console.log('Keeping auth state despite refresh error (non-auth error)');
		}
	}

	// Set the user in the locals object
	event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model) as App.User;

	// Log authentication state changes
	const isNowAuthenticated = event.locals.pb.authStore.isValid;
	if (wasAuthenticated && !isNowAuthenticated) {
		console.log('User was logged out during token refresh');
	} else if (!wasAuthenticated && isNowAuthenticated) {
		console.log('User authentication state restored');
	}

	// Protect API routes BEFORE resolving the request
	if (event.url.pathname.startsWith('/api')) {
		if (!event.locals.pb.authStore.isValid) {
			console.log(`Blocking unauthorized API access: ${event.url.pathname}`);
			console.log(`Auth token present: ${!!event.locals.pb.authStore.token}`);
			console.log(`Auth model present: ${!!event.locals.pb.authStore.model}`);
			console.log(`User agent: ${event.request.headers.get('user-agent')}`);
			console.log(`Referer: ${event.request.headers.get('referer')}`);

			// Return JSON error for API routes
			if (event.request.headers.get('accept')?.includes('application/json')) {
				return new Response(
					JSON.stringify({
						error: 'Authentication required',
						code: 'UNAUTHORIZED',
						redirectTo: '/app/auth/login',
						debug: {
							path: event.url.pathname,
							hasToken: !!event.locals.pb.authStore.token,
							hasModel: !!event.locals.pb.authStore.model,
							timestamp: new Date().toISOString()
						}
					}),
					{
						status: 401,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			}

			throw redirect(303, '/app/auth/login');
		}
	}

	// Protect learning routes - require authentication
	if (event.url.pathname.startsWith('/bullshift/learn')) {
		if (!event.locals.pb.authStore.isValid) {
			console.log(`Blocking unauthorized learning route access: ${event.url.pathname}`);
			throw redirect(303, '/app/auth/login');
		}
	}

	// Resolve the request
	const response = await resolve(event);

	// Update the cookie with current auth state
	try {
		response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({
			secure: false // Set to true in production
		}));
	} catch (cookieError) {
		console.error('Failed to set auth cookie:', cookieError);
	}

	return response;
}

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event);
	});


export const handle = sequence(first, paraglideHandle);

export const handleError: HandleServerError = async ({ error, event }) => {
	console.error('Server error:', error);
	
	try {
		// Create detailed error information for server errors
		const errorData = {
			// Basic error information
			message: (error as Error).message || 'Unknown server error',
			name: (error as Error).name || 'Error',
			stack: (error as Error).stack || 'No stack trace available',
			
			// Request context information
			url: event.url.href,
			pathname: event.url.pathname,
			searchParams: event.url.search,
			hash: event.url.hash,
			method: event.request.method,
			
			// Headers (excluding sensitive information)
			userAgent: event.request.headers.get('user-agent') || 'Unknown',
			accept: event.request.headers.get('accept') || 'Unknown',
			acceptLanguage: event.request.headers.get('accept-language') || 'Unknown',
			acceptEncoding: event.request.headers.get('accept-encoding') || 'Unknown',
			referer: event.request.headers.get('referer') || 'Unknown',
			
			// Client information
			clientAddress: event.getClientAddress() || 'Unknown',
			
			// User and session information
			user: event.locals?.user?.id || null,
			sessionToken: event.locals?.sessionToken || null,
			posthogId: event.locals?.posthogId || null,
			
			// Server environment
			nodeVersion: process.version,
			platform: process.platform,
			arch: process.arch,
			
			// Timing information
			timestamp: new Date().toISOString(),
			
			// Error categorization
			source: 'server',
			type: 'server_error',
			severity: 'error',
			
			// Additional technical details
			errorString: String(error),
			errorConstructor: (error as Error).constructor?.name || 'Unknown',
			
			// Route information
			routeId: event.route?.id || 'Unknown'
		};

		// Log to PocketBase (use a dedicated admin connection if needed)
		await pb.collection('errors').create(errorData);
	} catch (logError) {
		console.error('Failed to log server error to database:', logError);
		// Fallback logging with minimal data
		try {
			await pb.collection('errors').create({
				message: `Server error logging failed: ${(error as Error).message}`,
				originalError: String(error),
				loggingError: String(logError),
				source: 'server',
				type: 'logging_error',
				timestamp: new Date().toISOString(),
				url: event.url.href,
				method: event.request.method
			});
		} catch (secondaryError) {
			console.error('Failed to log server error logging failure:', secondaryError);
		}
	}

	return {
		message: 'An unexpected server error occurred'
	};
};
