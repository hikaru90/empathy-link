import { user } from '$store/auth';
import { get } from 'svelte/store';
import { pb } from '$scripts/pocketbase';
// export const prerender = true;

// Only intercept console.error on the client side
if (typeof window !== 'undefined') {
	const originalConsoleError = console.error;
	console.error = async (...args) => {
		for (const arg of args) {
			if (arg instanceof Error) {
				// Don't log AbortErrors as they're normal during navigation
				if (arg.name === 'AbortError') {
					return;
				}
				
				const userId = get(user)?.id;
				originalConsoleError(arg.message);
				originalConsoleError(arg.stack);

				try {
					// Create detailed error information for console errors
					const errorData = {
						// Basic error information
						message: arg.message || 'Unknown console error',
						name: arg.name || 'Error',
						stack: arg.stack || 'No stack trace available',
						
						// Context information (browser environment)
						url: window.location.href,
						pathname: window.location.pathname,
						searchParams: window.location.search,
						
						// User information
						user: userId,
						
						// Browser context
						userAgent: navigator.userAgent || 'Unknown',
						language: navigator.language || 'Unknown',
						platform: navigator.platform || 'Unknown',
						
						// Viewport information
						viewportWidth: window.innerWidth,
						viewportHeight: window.innerHeight,
						
						// Additional context
						timestamp: new Date().toISOString(),
						source: 'console',
						type: 'console_error',
						severity: 'error',
						
						// Additional arguments passed to console.error
						additionalArgs: args.slice(1).map(a => String(a)).join(' '),
						
						// Error details
						errorString: String(arg),
						errorConstructor: arg.constructor?.name || 'Unknown'
					};

					console.log('About to log console error data to PocketBase:', errorData);
					const result = await pb.collection('errors').create(errorData);
					console.log('Successfully logged console error to PocketBase:', result);
				} catch (logError) {
					// Fallback logging with minimal data
					try {
						await pb.collection('errors').create({
							message: `Console error logging failed: ${arg.message}`,
							originalError: String(arg),
							loggingError: String(logError),
							user: userId,
							source: 'console',
							type: 'logging_error',
							timestamp: new Date().toISOString()
						});
					} catch (secondaryError) {
						// Silent failure - we don't want to create infinite loops
					}
				}
			} else {
				originalConsoleError(arg);
			}
		}
	};
}

export const load = async ({ url, data }) => {

	if (data.user) user.set(data.user);
	else user.set(undefined);

	return {
		locale: data.locale,
		route: url.pathname,
		user: data.user
	};
};

