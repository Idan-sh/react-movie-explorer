/**
 * TMDB API Endpoints
 *
 * Centralized API endpoint paths.
 * Used by sagas to make API calls.
 */

export const TMDB_ENDPOINTS = {
  MOVIES: {
    POPULAR: '/movie/popular',
    NOW_PLAYING: '/movie/now_playing',
    DETAILS: (id: number): string => `/movie/${id}`,
  },
  SEARCH: {
    MOVIES: '/search/movie',
  },
} as const;
