/**
 * Movies Store Types
 *
 * Types for Redux slice payloads and state.
 * State is category-keyed to support simultaneous data for preview rows.
 */

import type { RequestStatus } from '@/shared/types';
import type { TmdbMovie, MovieList } from './movie.types';

/**
 * State for a single movie list (popular or now playing)
 */
export interface MovieListState {
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
  status: RequestStatus;
  error: string | null;
}

/**
 * Root movies state - keyed by list type
 */
export interface MoviesState {
  popular: MovieListState;
  nowPlaying: MovieListState;
}

/**
 * Payload for fetchMovies action
 */
export interface FetchMoviesPayload {
  list: MovieList;
  page: number;
}

/**
 * Payload for fetchMoviesSuccess action
 */
export interface FetchMoviesSuccessPayload {
  list: MovieList;
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
}

/**
 * Payload for fetchMoviesFailure action
 */
export interface FetchMoviesFailurePayload {
  list: MovieList;
  error: string;
}
