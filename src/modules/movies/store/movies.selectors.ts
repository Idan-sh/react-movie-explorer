/**
 * Movies Selectors
 *
 * Functions to read movies state from the store.
 * Pre-built selectors for each list type to maintain memoization.
 *
 * USAGE:
 * const selectors = getListSelectors(MOVIE_LIST.POPULAR);
 * const movies = useAppSelector(selectors.selectMovies);
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { MOVIE_LIST, MOVIE_LIST_STATE_KEY } from '../constants';
import type { MovieList, MovieListState } from '../types';

/**
 * Base selector - gets the movies slice
 */
const selectMoviesState = (state: RootState) => state[SLICE_NAMES.MOVIES];

/**
 * Builds a stable set of selectors for a given list type.
 * Called once per list type at module load (not per render).
 */
function buildListSelectors(list: MovieList) {
  const key = MOVIE_LIST_STATE_KEY[list];

  const selectState = createSelector(
    [selectMoviesState],
    (moviesState): MovieListState => moviesState[key]
  );

  const selectMovies = createSelector(
    [selectState],
    (listState) => listState.page.movies
  );

  const selectPageNumber = createSelector(
    [selectState],
    (listState) => listState.page.pageNumber
  );

  const selectNumberOfPages = createSelector(
    [selectState],
    (listState) => listState.page.numberOfPages
  );

  const selectHasNextPage = createSelector(
    [selectState],
    (listState) => listState.nextPage !== null
  );

  const selectError = createSelector(
    [selectState],
    (listState) => listState.error
  );

  const selectIsLoading = createSelector(
    [selectState],
    (listState) => listState.status === REQUEST_STATUS.LOADING
  );

  const selectHasError = createSelector(
    [selectState],
    (listState) => listState.status === REQUEST_STATUS.ERROR
  );

  const selectHasMorePages = createSelector(
    [selectState],
    (listState) => listState.page.pageNumber < listState.page.numberOfPages
  );

  return {
    selectState,
    selectMovies,
    selectPageNumber,
    selectNumberOfPages,
    selectHasNextPage,
    selectError,
    selectIsLoading,
    selectHasError,
    selectHasMorePages,
  };
}

/**
 * Pre-built selectors for each list type.
 * Created once at module load - stable references for memoization.
 */
const popularSelectors = buildListSelectors(MOVIE_LIST.POPULAR);
const nowPlayingSelectors = buildListSelectors(MOVIE_LIST.NOW_PLAYING);

const selectorsByList: Record<MovieList, ReturnType<typeof buildListSelectors>> = {
  [MOVIE_LIST.POPULAR]: popularSelectors,
  [MOVIE_LIST.NOW_PLAYING]: nowPlayingSelectors,
};

/**
 * Get all selectors for a given list type.
 * Returns stable references - safe to use in useAppSelector.
 */
export function getListSelectors(list: MovieList): ReturnType<typeof buildListSelectors> {
  return selectorsByList[list];
}
