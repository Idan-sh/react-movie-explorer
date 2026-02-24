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

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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
    // Append API key to all requests
    config.params = {
      ...config.params,
      api_key: env.tmdb.apiKey,
    };

    // Dev logging
    if (env.isDev) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Extracts data from response (no need to access .data everywhere)
 * - Transforms errors to consistent format
 */
tmdbClient.interceptors.response.use(
  (response) => {
    // Return the data directly, not the full response
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development
    if (env.isDev) {
      console.error('[API Error]', error.message);
    }

    // Transform to consistent error format
    const apiError = {
      message: getErrorMessage(error),
      status: error.response?.status,
      code: error.code,
    };

    return Promise.reject(apiError);
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
