import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { MOVIE_LIST, MOVIE_LIST_STATE_KEY } from '../constants';
import type { MovieList, MovieListState } from '../types';

const selectMoviesState = (state: RootState) => state[SLICE_NAMES.MOVIES];

function buildListSelectors(list: MovieList) {
  const key = MOVIE_LIST_STATE_KEY[list];

  const selectState = createSelector(
    [selectMoviesState],
    (moviesState): MovieListState => moviesState[key],
  );

  const selectMovies = createSelector(
    [selectState],
    (listState) => listState.page.movies,
  );

  const selectPageNumber = createSelector(
    [selectState],
    (listState) => listState.page.pageNumber,
  );

  const selectHasNextPage = createSelector(
    [selectState],
    (listState) => listState.nextPage !== null,
  );

  const selectError = createSelector(
    [selectState],
    (listState) => listState.error,
  );

  const selectIsIdle = createSelector(
    [selectState],
    (listState) => listState.status === REQUEST_STATUS.IDLE,
  );

  const selectIsLoading = createSelector(
    [selectState],
    (listState) => listState.status === REQUEST_STATUS.LOADING,
  );

  const selectHasError = createSelector(
    [selectState],
    (listState) => listState.status === REQUEST_STATUS.ERROR,
  );

  const selectHasMorePages = createSelector(
    [selectState],
    (listState) => listState.page.pageNumber < listState.page.numberOfPages,
  );

  const selectMovieCount = createSelector(
    [selectMovies],
    (movies) => movies.length,
  );

  const selectCanLoad = createSelector(
    [selectHasNextPage, selectHasMorePages, selectIsLoading],
    (hasNext, hasMore, isLoading) => hasNext || (hasMore && !isLoading),
  );

  return {
    selectState,
    selectMovies,
    selectPageNumber,
    selectHasNextPage,
    selectError,
    selectIsIdle,
    selectIsLoading,
    selectHasError,
    selectHasMorePages,
    selectMovieCount,
    selectCanLoad,
  };
}

const popularSelectors = buildListSelectors(MOVIE_LIST.POPULAR);
const nowPlayingSelectors = buildListSelectors(MOVIE_LIST.NOW_PLAYING);

const selectorsByList: Record<
  MovieList,
  ReturnType<typeof buildListSelectors>
> = {
  [MOVIE_LIST.POPULAR]: popularSelectors,
  [MOVIE_LIST.NOW_PLAYING]: nowPlayingSelectors,
};

export function getListSelectors(
  list: MovieList,
): ReturnType<typeof buildListSelectors> {
  return selectorsByList[list];
}
