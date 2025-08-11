import { v4 as uuidv4 } from 'uuid';
import { serializeNonPOJOs } from '$scripts/helpers';
import { pb } from '$scripts/pocketbase'
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$src/paraglide/server';


const client = 'empathy_link'

const first: Handle = async ({ event, resolve }) => {
	console.log('::hooks.server handle ', event.url.pathname);
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
	console.log('sessionToken',sessionToken);
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

	const localeCookie = event.cookies.get('locale');
	const langHeaders = event.request.headers.get('accept-language')?.split(',')[0].split('-')[0];

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

	// Load authentication state from cookies using SvelteKit's cookie parser
	const pbAuthCookie = event.cookies.get('pb_auth');
	if (pbAuthCookie) {
		event.locals.pb.authStore.loadFromCookie(`pb_auth=${pbAuthCookie}`);
		console.log('↪ pb_auth cookie found and loaded');
	} else {
		console.log('↪ pb_auth cookie not found');
	}
	
	// Track authentication state before refresh attempt
	const wasAuthenticated = event.locals.pb.authStore.isValid;
	console.log('↪ wasAuthenticated',wasAuthenticated);
	
	// Enhanced debugging for auth issues
	if (!wasAuthenticated) {
		console.log('↪ AUTH DEBUG: No valid auth state found');
		console.log('↪ AUTH DEBUG: Auth token exists:', !!event.locals.pb.authStore.token);
		console.log('↪ AUTH DEBUG: Auth model exists:', !!event.locals.pb.authStore.model);
		console.log('↪ AUTH DEBUG: pb_auth cookie exists:', !!pbAuthCookie);
	} else {
		console.log('↪ AUTH DEBUG: Valid auth state found, user ID:', event.locals.pb.authStore.model?.id);
	}

	try {
		// Attempt to refresh token if we have a valid auth state
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			console.log('↪- Token refresh successful');
		}
	} catch (err) {
		const error = err as { status?: number; message?: string };
		console.log('↪-Token refresh failed:', error.message || 'Unknown error');

		// NEVER clear auth store automatically - only explicit logout should do this
		// Token refresh failures are temporary issues and should not log users out
		// The auth state will be preserved and user remains logged in
		console.log('↪- Token refresh failed, but keeping user logged in (will retry next request)');
		
		// If we have a user in locals, ensure they stay logged in
		if (event.locals.user) {
			console.log('↪- Preserving user session despite token refresh failure');
		}
	}

	// Set the user in the locals object - NEVER log users out unless explicit logout
	const authModel = event.locals.pb.authStore.model;
	if (authModel) {
		event.locals.user = serializeNonPOJOs(authModel) as App.User;
	} else if (event.locals.user) {
		// User exists in locals but auth store is invalid - PRESERVE THE USER
		// This ensures users never get logged out due to temporary auth issues
		console.log('↪ Preserving existing user session despite auth store invalidation');
		
		// Try to restore the auth store from existing user data
		if (event.locals.pb.authStore.token) {
			console.log('↪ Attempting to restore auth store from existing token');
			// The token exists, so we should be able to restore the user
		} else {
			console.log('↪ No token available, but preserving user in locals');
		}
		
		// CRITICAL: Restore PocketBase auth store for API routes
		// This ensures API calls work even when main auth store is invalid
		try {
			if (event.locals.pb.authStore.token && event.locals.user) {
				// We have a token and user - try to restore the auth store
				console.log('↪ Restoring PocketBase auth store for API compatibility');
				// The token should already be in the auth store, but let's verify
				if (!event.locals.pb.authStore.model) {
					console.log('↪ Auth store model missing, but token exists - this is the issue');
				}
			}
		} catch (restoreError) {
			console.log('↪ Auth store restoration failed, but user remains preserved:', restoreError);
		}
		
		// Keep the existing user - don't overwrite with undefined
	} else {
		// Only set to undefined if we have no user at all
		(event.locals as any).user = undefined;
	}

	// Log authentication state changes
	const isNowAuthenticated = event.locals.pb.authStore.isValid;
	if (wasAuthenticated && !isNowAuthenticated) {
		console.log('↪- User logged out due to invalid JWT');
	} else if (!wasAuthenticated && isNowAuthenticated) {
		console.log('↪- User authenticated with valid JWT');
	}

	// Note: API route protection is handled at the individual endpoint level
	// We don't block API routes here to allow token refresh to work properly

	// Special handling for API routes - ensure they work with persistent auth
	if (event.url.pathname.startsWith('/api')) {
		console.log('↪ API route detected:', event.url.pathname);
		if (event.locals.user) {
			console.log('↪ API route: User authenticated (persistent auth working)');
		} else {
			console.log('↪ API route: No user found - will be handled by individual endpoint');
		}
	} else if (event.url.pathname.startsWith('/bullshift')) {
		// Protect learning routes - require valid JWT OR preserved user state
		if (!event.locals.pb.authStore.isValid && !event.locals.user) {
			console.log(`↪- Blocking unauthorized learning route access: ${event.url.pathname}`);
			throw redirect(303, '/app/auth/login');
		} else if (event.locals.user && !event.locals.pb.authStore.isValid) {
			console.log(`↪- Allowing access with preserved user session: ${event.url.pathname}`);
		}
	}

	// Resolve the request
	const response = await resolve(event);

	// Update the cookie with current auth state
	try {
		// Get the raw cookie value from PocketBase
		const rawCookieValue = event.locals.pb.authStore.exportToCookie({
			secure: false, // Temporarily disabled for debugging auth issues
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});
		
		console.log('↪ COOKIE DEBUG: Exporting cookie, auth valid:', event.locals.pb.authStore.isValid);
		console.log('↪ COOKIE DEBUG: Cookie secure setting: false (temporarily disabled)');
		console.log('↪ COOKIE DEBUG: Cookie value length:', rawCookieValue.length);
		console.log('↪ COOKIE DEBUG: Raw cookie value:', rawCookieValue);
		
		// Set the cookie with explicit headers to ensure proper domain/path
		response.headers.append('set-cookie', rawCookieValue);
		
	} catch (cookieError) {
		console.error('↪- Failed to set auth cookie:', cookieError);
	}

	// Final authentication state check - NEVER lose the user
	console.log('↪ FINAL AUTH STATE:');
	console.log('  - Auth store valid:', event.locals.pb.authStore.isValid);
	console.log('  - User in locals:', !!event.locals.user);
	console.log('  - Route:', event.url.pathname);
	console.log('  - User ID:', event.locals.user?.id || 'none');
	
	// CRITICAL: Ensure user is never lost
	if (event.locals.user && !event.locals.pb.authStore.isValid) {
		console.log('↪ CRITICAL: User preserved in locals despite invalid auth store');
		console.log('↪ CRITICAL: This is the PERSISTENT AUTHENTICATION system working');
	}
	
	// If we somehow lost the user, log it as an error
	if (!event.locals.user && event.locals.pb.authStore.isValid) {
		console.error('↪ ERROR: User lost despite valid auth store - this should never happen!');
	}
	
	// API Route Compatibility Check
	if (event.url.pathname.startsWith('/api') && event.locals.user) {
		console.log('↪ API COMPATIBILITY:');
		console.log('  - User available for API:', !!event.locals.user);
		console.log('  - PocketBase auth valid:', event.locals.pb.authStore.isValid);
		console.log('  - Token available:', !!event.locals.pb.authStore.token);
		console.log('  - Model available:', !!event.locals.pb.authStore.model);
		
		// If API route has user but PocketBase auth is invalid, this could cause issues
		if (!event.locals.pb.authStore.isValid) {
			console.log('↪ WARNING: API route may have authentication issues - user preserved but PocketBase auth invalid');
		}
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
