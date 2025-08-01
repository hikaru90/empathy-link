import { pb } from '$scripts/pocketbase';
import { goto } from '$app/navigation';
import type { HandleClientError } from '@sveltejs/kit';

// Sync client PocketBase with server auth state on page load
if (typeof window !== 'undefined') {
  // Load auth state from cookies on client side
  pb.authStore.loadFromCookie(document.cookie);

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', async (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log unhandled promise rejections to PocketBase if user is authenticated
    if (pb.authStore.isValid) {
      try {
        const error = event.reason;
        const errorData = {
          // Basic error information
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'UnhandledPromiseRejection',
          stack: error instanceof Error ? error.stack : 'No stack trace available',
          
          // Enhanced context information
          url: window.location.href,
          pathname: window.location.pathname,
          searchParams: window.location.search,
          hash: window.location.hash,
          
          // Browser and environment context
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          
          // Viewport and screen information
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          
          // Page and performance context
          referrer: document.referrer,
          title: document.title,
          readyState: document.readyState,
          
          // User and session information
          user: pb.authStore.model?.id || null,
          isValid: pb.authStore.isValid,
          
          // Timing information
          timestamp: new Date().toISOString(),
          timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: new Date().getTimezoneOffset(),
          
          // Error categorization
          source: 'client',
          type: 'unhandled_promise_rejection',
          severity: 'error',
          
          // Promise-specific information
          errorString: String(error),
          errorConstructor: error instanceof Error ? error.constructor?.name : 'Unknown',
          promiseRejectionType: 'unhandled'
        };

        console.log('About to log error data to PocketBase:', errorData);
        const result = await pb.collection('errors').create(errorData);
        console.log('Successfully logged error to PocketBase:', result);
      } catch (logError) {
        console.error('Failed to log unhandled promise rejection to server:', logError);
        // Try to log the logging failure with minimal data
        try {
          pb.collection('errors').create({
            message: `Failed to log promise rejection: ${logError}`,
            originalError: String(event.reason),
            source: 'client',
            type: 'logging_error',
            timestamp: new Date().toISOString()
          });
        } catch (secondaryError) {
          console.error('Failed to log promise rejection logging failure:', secondaryError);
        }
      }
    }
  });

  // Intercept fetch requests to handle auth failures gracefully
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // If we get a 401 or 403 on API calls, try to refresh the token ONCE
      if ((response.status === 401 || response.status === 403) && args[0]?.toString().startsWith('/api')) {
        console.log('API authentication failed, attempting token refresh...');
        
        try {
          // Try to refresh the token
          await pb.collection('users').authRefresh();
          console.log('Token refresh successful, retrying API call...');
          
          // Retry the original request
          const retryResponse = await originalFetch(...args);
          
          if (retryResponse.ok) {
            console.log('API call succeeded after token refresh');
            return retryResponse;
          } else {
            console.log('API call still failed after token refresh - letting component handle it');
          }
          
          return retryResponse;
        } catch (refreshError) {
          console.log('Token refresh failed - letting component handle the 401:', refreshError);
          
          // DON'T auto-logout! Let components handle 401s gracefully
          // The user should only be logged out via explicit /logout route
          // Components can show error messages, disable features, etc.
        }
      }
      
      return response;
    } catch (error) {
      // Don't log AbortErrors as they're normal during navigation
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
      throw error;
    }
  };
}

export const handleError: HandleClientError = async ({ error, event }) => {
  console.error('Client error:', error);
  
  // Log client errors to PocketBase if user is authenticated
  if (pb.authStore.isValid) {
    try {
      const errorData = {
        // Basic error information
        message: (error as Error).message || 'Unknown error',
        name: (error as Error).name || 'Error',
        stack: (error as Error).stack || 'No stack trace available',
        
        // Enhanced context information
        url: event.url.href, // Full URL instead of just pathname
        pathname: event.url.pathname,
        searchParams: event.url.search,
        hash: event.url.hash,
        
        // Browser and environment context
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        
        // Viewport and screen information
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        
        // Page and performance context
        referrer: document.referrer,
        title: document.title,
        readyState: document.readyState,
        
        // User and session information
        user: pb.authStore.model?.id || null,
        isValid: pb.authStore.isValid,
        
        // Timing information
        timestamp: new Date().toISOString(),
        timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        
        // Error categorization
        source: 'client',
        type: 'unhandled_error',
        severity: 'error',
        
        // Additional technical details
        errorString: String(error),
        errorConstructor: (error as Error).constructor?.name || 'Unknown'
      };

      console.log('About to log client error data to PocketBase:', errorData);
      const result = await pb.collection('errors').create(errorData);
      console.log('Successfully logged client error to PocketBase:', result);
    } catch (logError) {
      console.error('Failed to log error to server:', logError);
      // Try to log the logging failure with minimal data
      try {
        pb.collection('errors').create({
          message: `Failed to log error: ${logError}`,
          originalError: String(error),
          source: 'client',
          type: 'logging_error',
          timestamp: new Date().toISOString()
        });
      } catch (secondaryError) {
        console.error('Failed to log error logging failure:', secondaryError);
      }
    }
  }

  return {
    message: 'An unexpected error occurred'
  };
}; 