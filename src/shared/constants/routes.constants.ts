/**
 * Application Routes
 *
 * Centralized route paths. Use ROUTES for navigation and route definitions.
 * ROUTES.path() helpers build URLs with params — avoids string concatenation at call sites.
 */

export const ROUTES = {
  HOME: '/',
  MOVIE_DETAILS: '/movie/:id',
  movieDetails: (id: number): string => `/movie/${id}`,
} as const;
