/**
 * Movies Store Types
 *
 * Types for Redux slice payloads and state.
 */

import type { RequestStatus } from '@/shared/types';
import type { TmdbMovie, MovieCategory } from './movie.types';

/**
 * Movies state shape
 */
export interface MoviesState {
  movies: TmdbMovie[];
  category: MovieCategory;
  page: number;
  totalPages: number;
  status: RequestStatus;
  error: string | null;
}

/**
 * Payload for fetchMovies action
 */
export interface FetchMoviesPayload {
  category: MovieCategory;
  page: number;
}

/**
 * Payload for fetchMoviesSuccess action
 */
export interface FetchMoviesSuccessPayload {
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
}
