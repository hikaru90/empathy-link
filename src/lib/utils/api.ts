import { pb } from '$scripts/pocketbase';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: any;
}

export class AuthenticationError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Makes an authenticated API call with automatic token refresh and error handling
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!browser) {
    throw new Error('authenticatedFetch can only be used in browser environment');
  }

  // Ensure headers object exists
  const headers = new Headers(options.headers);
  
  // Add content type if not specified and body is present
  if (options.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  // Make the request
  const requestOptions: RequestInit = {
    ...options,
    headers
  };

  try {
    let response = await fetch(url, requestOptions);

    // If we get an authentication error, try to refresh the token
    if (response.status === 401 || response.status === 403) {
      console.log('Authentication failed, attempting token refresh...');
      
      try {
        // Attempt to refresh the token
        await pb.collection('users').authRefresh();
        console.log('Token refresh successful, retrying request...');
        
        // Retry the original request
        response = await fetch(url, requestOptions);
        
        if (response.ok) {
          console.log('Request succeeded after token refresh');
          return response;
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        
        // Clear authentication state
        pb.authStore.clear();
        
        // Save current location for redirect after login
        const currentPath = window.location.pathname + window.location.search;
        document.cookie = `loginRedirectTarget=${encodeURIComponent(currentPath)}; path=/; max-age=600`;
        
        // Redirect to login
        await goto('/app/auth/login');
        
        throw new AuthenticationError('Authentication failed and token refresh unsuccessful');
      }
    }

    // Check if response indicates an authentication error in JSON format
    if (!response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const errorData = await response.json();
      if (errorData.code === 'UNAUTHORIZED') {
        throw new AuthenticationError(errorData.error || 'Authentication required', response.status);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    // For network errors or other issues, wrap in ApiError
    const apiError = new Error(`API request failed: ${(error as Error).message}`) as ApiError;
    apiError.status = (error as any).status;
    apiError.data = (error as any).data;
    throw apiError;
  }
}

/**
 * Convenience method for making authenticated JSON API calls
 */
export async function authenticatedApiCall<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}`) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  
  return response.json();
}

/**
 * POST request with JSON body
 */
export async function post<T = any>(url: string, data: any): Promise<T> {
  return authenticatedApiCall<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

/**
 * GET request
 */
export async function get<T = any>(url: string): Promise<T> {
  return authenticatedApiCall<T>(url, {
    method: 'GET'
  });
}

/**
 * PUT request with JSON body
 */
export async function put<T = any>(url: string, data: any): Promise<T> {
  return authenticatedApiCall<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request
 */
export async function del<T = any>(url: string): Promise<T> {
  return authenticatedApiCall<T>(url, {
    method: 'DELETE'
  });
} 