/**
 * Movies Store Types
 *
 * Types for Redux slice payloads and state.
 * State is category-keyed to support simultaneous data for preview rows.
 */

import type { RequestStatus } from '@/shared/types';
import type { TmdbMovie, MovieList } from './movie.types';

/**
 * A single page of movie results
 */
export interface MoviesPage {
  movies: TmdbMovie[];
  pageNumber: number;
  numberOfPages: number;
}

/**
 * State for a single movie list (popular or now playing)
 */
export interface MovieListState {
  page: MoviesPage;
  nextPage: MoviesPage | null;
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
  pageNumber: number;
}

/**
 * Payload for fetchMoviesSuccess action
 */
export interface FetchMoviesSuccessPayload {
  list: MovieList;
  page: MoviesPage;
}

/**
 * Payload for fetchMoviesFailure action
 */
export interface FetchMoviesFailurePayload {
  list: MovieList;
  error: string;
}

/**
 * Payload for prefetchSuccess action — stores next page in buffer
 */
export interface PrefetchSuccessPayload {
  list: MovieList;
  page: MoviesPage;
}

/**
 * Payload for showNextPage action — applies buffer to visible movies
 */
export interface ShowNextPagePayload {
  list: MovieList;
}
