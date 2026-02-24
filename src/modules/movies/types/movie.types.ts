/**
 * Movie Types
 *
 * Based on TMDB API responses:
 * https://developer.themoviedb.org/reference/movie-popular-list
 * https://developer.themoviedb.org/reference/movie-now-playing-list
 */

import { MOVIE_CATEGORY } from '../constants';

/**
 * Movie object from TMDB API list endpoints (popular, now_playing)
 *
 * Fields exactly as returned from API.
 * Note: poster_path and backdrop_path can be null when no image exists.
 */
export interface TmdbMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * Paginated response wrapper from TMDB API
 */
export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Response from /movie/popular and /movie/now_playing endpoints
 */
export type TmdbMovieListResponse = TmdbPaginatedResponse<TmdbMovie>;

/**
 * Category filter type - derived from MOVIE_CATEGORY constant values
 */
export type MovieCategory = (typeof MOVIE_CATEGORY)[keyof typeof MOVIE_CATEGORY];
