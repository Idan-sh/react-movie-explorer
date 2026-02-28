/**
 * Movies Saga
 *
 * Handles side effects for movies module:
 * - Fetches movies from TMDB API
 * - Prefetches next page after each successful load
 * - Handles errors (silent for prefetch, reported for direct fetches)
 *
 * PREFETCH FLOW:
 * After every fetchMoviesSuccess or showNextPage, the saga silently
 * fetches the next page and stores it in the buffer via prefetchSuccess.
 * If the prefetch fails, it's silently ignored — the UI falls back
 * to a regular fetch with skeleton loading when the user clicks "Load More".
 */

import { call, put, select, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import { tmdbClient } from '@/core/api';
import type {
  FetchMoviesPayload,
  FetchMoviesSuccessPayload,
  ShowNextPagePayload,
  TmdbMovieListResponse,
  MovieList,
  MoviesPage,
} from '../types';
import { getListEndpoint, toMoviesPage } from '../utils';
import { getListSelectors } from './movies.selectors';
import {
  fetchMovies,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  prefetchSuccess,
  showNextPage,
} from './movies.slice';

/**
 * Fetches a page of movies from TMDB API
 */
function* fetchPageFromApi(list: MovieList, pageNumber: number): Generator {
  const endpoint = getListEndpoint(list);
  const response = yield call(tmdbClient.get<TmdbMovieListResponse>, endpoint, {
    params: { page: pageNumber },
  });
  return toMoviesPage((response as AxiosResponse<TmdbMovieListResponse>).data);
}

/**
 * Fetches movies from TMDB API — triggered by component dispatch
 */
function* fetchMoviesSaga(action: PayloadAction<FetchMoviesPayload>): Generator {
  try {
    const { list, pageNumber } = action.payload;
    const page = yield* fetchPageFromApi(list, pageNumber);

    yield put(fetchMoviesSuccess({ list, page: page as MoviesPage }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movies';
    yield put(fetchMoviesFailure({ list: action.payload.list, error: message }));
  }
}

/**
 * Silently prefetches the next page after a successful load.
 * Failures are ignored — UI falls back to regular fetch if needed.
 */
function* prefetchNextPageSaga(list: MovieList): Generator {
  try {
    const selectors = getListSelectors(list);
    const hasMorePages = (yield select(selectors.selectHasMorePages)) as boolean;
    if (!hasMorePages) return;

    const currentPageNumber = (yield select(selectors.selectPageNumber)) as number;
    const page = yield* fetchPageFromApi(list, currentPageNumber + 1);

    yield put(prefetchSuccess({ list, page: page as MoviesPage }));
  } catch {
    // Silent failure — user won't notice, falls back to regular fetch
  }
}

/**
 * After successful fetch → prefetch next page
 */
function* onFetchSuccessSaga(action: PayloadAction<FetchMoviesSuccessPayload>): Generator {
  yield* prefetchNextPageSaga(action.payload.list);
}

/**
 * After showNextPage → prefetch the next-next page
 */
function* onShowNextPageSaga(action: PayloadAction<ShowNextPagePayload>): Generator {
  yield* prefetchNextPageSaga(action.payload.list);
}

/**
 * Root saga for movies module
 */
export function* moviesSaga(): Generator {
  yield takeEvery(fetchMovies.type, fetchMoviesSaga);
  yield takeEvery(fetchMoviesSuccess.type, onFetchSuccessSaga);
  yield takeEvery(showNextPage.type, onShowNextPageSaga);
}
