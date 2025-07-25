import { pb } from '$scripts/pocketbase';
import { get } from 'svelte/store';
import { user } from '$store/auth';

export interface ErrorLogOptions {
  error: Error | unknown;
  context?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  type?: string;
  userId?: string;
}

/**
 * Enhanced error logging utility for structured error reporting
 * Use this for manual error logging throughout the application
 */
export const logError = async (options: ErrorLogOptions): Promise<void> => {
  const {
    error,
    context = {},
    severity = 'medium',
    source = 'application',
    type = 'manual_error',
    userId
  } = options;

  try {
    // Extract error information
    const errorInfo = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack,
      constructor: error.constructor?.name
    } : {
      message: String(error),
      name: 'UnknownError',
      stack: 'No stack trace available',
      constructor: 'Unknown'
    };

    // Get user information
    const currentUser = userId || get(user)?.id || null;

    // Browser context (if available)
    const browserContext = typeof window !== 'undefined' ? {
      url: window.location.href,
      pathname: window.location.pathname,
      searchParams: window.location.search,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    } : {};

    const errorData = {
      // Core error information
      ...errorInfo,
      
      // Categorization
      source,
      type,
      severity,
      
      // Context
      ...browserContext,
      ...context,
      
      // User and session
      user: currentUser,
      
      // Timing
      timestamp: new Date().toISOString(),
      timezoneName: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Unknown',
      timezoneOffset: typeof Date !== 'undefined' ? new Date().getTimezoneOffset() : null,
      
      // Additional details
      errorString: String(error)
    };

    // Log to PocketBase
    await pb.collection('errors').create(errorData);
    
    console.warn('Error logged to database:', errorData);
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
    console.error('Original error that failed to log:', error);
    
    // Fallback to console logging
    console.error(`[${severity.toUpperCase()}] ${source}:${type}`, error, context);
  }
};

/**
 * Wrapper for async functions that automatically logs errors
 */
export const withErrorLogging = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: Omit<ErrorLogOptions, 'error'> = {}
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await logError({
        error,
        ...context,
        source: context.source || 'async_function',
        type: context.type || 'async_error'
      });
      throw error; // Re-throw the error after logging
    }
  }) as T;
};

/**
 * Log performance issues or warnings
 */
export const logPerformanceIssue = async (
  description: string,
  metrics: Record<string, number>,
  context: Record<string, any> = {}
): Promise<void> => {
  await logError({
    error: new Error(description),
    severity: 'low',
    source: 'performance',
    type: 'performance_issue',
    context: {
      ...metrics,
      ...context
    }
  });
};

/**
 * Log user-triggered errors (e.g., form validation, user actions)
 */
export const logUserError = async (
  message: string,
  userAction: string,
  context: Record<string, any> = {}
): Promise<void> => {
  await logError({
    error: new Error(message),
    severity: 'low',
    source: 'user_action',
    type: 'user_error',
    context: {
      userAction,
      ...context
    }
  });
};

/**
 * Log API errors with request/response context
 */
export const logApiError = async (
  error: Error | unknown,
  endpoint: string,
  method: string,
  requestData?: any,
  responseData?: any
): Promise<void> => {
  await logError({
    error,
    severity: 'high',
    source: 'api',
    type: 'api_error',
    context: {
      endpoint,
      method,
      requestData: requestData ? JSON.stringify(requestData) : null,
      responseData: responseData ? JSON.stringify(responseData) : null
    }
  });
};