/**
 * Store Constants
 *
 * Centralized constants for Redux store configuration.
 * SAGA_IGNORED_ACTIONS: action types excluded from serializableCheck (saga-dispatched or saga-triggered).
 */

import { SLICE_NAMES } from '@/shared/constants';

export const SAGA_IGNORED_ACTIONS: string[] = [
  `${SLICE_NAMES.MOVIES}/fetchMovies`,
  `${SLICE_NAMES.MOVIES}/fetchMoviesSuccess`,
  `${SLICE_NAMES.MOVIES}/fetchMoviesFailure`,
  `${SLICE_NAMES.MOVIES}/prefetchSuccess`,
  `${SLICE_NAMES.MOVIES}/showNextPage`,
  `${SLICE_NAMES.MOVIE_DETAILS}/fetchMovieDetails`,
  `${SLICE_NAMES.MOVIE_DETAILS}/clearMovieDetails`,
  `${SLICE_NAMES.MOVIE_DETAILS}/fetchDetailsSuccess`,
  `${SLICE_NAMES.MOVIE_DETAILS}/fetchDetailsFailure`,
  `${SLICE_NAMES.SEARCH}/setSearchQuery`,
  `${SLICE_NAMES.SEARCH}/searchMoviesStart`,
  `${SLICE_NAMES.SEARCH}/searchMoviesSuccess`,
  `${SLICE_NAMES.SEARCH}/searchMoviesFailure`,
  `${SLICE_NAMES.SEARCH}/clearSearch`,
  `${SLICE_NAMES.SEARCH}/loadMore`,
];
