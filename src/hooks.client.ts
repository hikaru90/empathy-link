import { pb } from '$scripts/pocketbase';
import { goto } from '$app/navigation';
import type { HandleClientError } from '@sveltejs/kit';

// Sync client PocketBase with server auth state on page load
if (typeof window !== 'undefined') {
  // Load auth state from cookies on client side
  pb.authStore.loadFromCookie(document.cookie);

  // Intercept fetch requests to handle auth failures gracefully
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // If we get a 401 or 403 on API calls, try to refresh the token
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
            console.log('API call still failed after token refresh');
          }
          
          return retryResponse;
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          
          // Clear the auth state
          pb.authStore.clear();
          
          // Save current location for redirect after login
          const currentPath = window.location.pathname + window.location.search;
          document.cookie = `loginRedirectTarget=${encodeURIComponent(currentPath)}; path=/; max-age=600`; // 10 minutes
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/auth/login')) {
            goto('/app/auth/login');
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
}

export const handleError: HandleClientError = ({ error, event }) => {
  console.error('Client error:', error);
  
  // Log client errors to PocketBase if user is authenticated
  if (pb.authStore.isValid) {
    try {
      pb.collection('errors').create({
        message: (error as Error).message,
        stack: (error as Error).stack,
        url: event.url.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log error to server:', logError);
    }
  }

  return {
    message: 'An unexpected error occurred'
  };
}; 