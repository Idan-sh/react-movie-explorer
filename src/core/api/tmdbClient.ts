/**
 * TMDB API Client
 *
 * Single axios instance for all TMDB API calls.
 *
 * FEATURES:
 * - Base URL pre-configured
 * - API key auto-appended to all requests
 * - Response interceptor for error handling
 * - Request interceptor for logging (dev only)
 *
 * USAGE:
 * import { tmdbClient } from '@/core/api';
 * const response = await tmdbClient.get('/movie/popular');
 */

import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config';

// Create axios instance with TMDB base config
export const tmdbClient = axios.create({
  baseURL: env.tmdb.baseUrl,
  timeout: 10_000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Adds API key to every request
 * - Logs requests in development
 */
tmdbClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = {
      ...config.params,
      api_key: env.tmdb.apiKey,
    };

    if (env.isDev) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  }
);

/**
 * Response interceptor
 * - On success: returns the full response (call sites use response.data).
 * - On error: rejects with an Error so sagas can use error.message for user-facing text.
 */
tmdbClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (env.isDev) {
      console.error('[API Error]', error.message);
    }
    const message = getErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

/**
 * Extract user-friendly error message
 */
function getErrorMessage(error: AxiosError): string {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const status = error.response.status;

  switch (status) {
    case 401:
      return 'Invalid API key.';
    case 404:
      return 'Resource not found.';
    case 429:
      return 'Too many requests. Please wait a moment.';
    case 500:
    case 502:
    case 503:
      return 'Server error. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
