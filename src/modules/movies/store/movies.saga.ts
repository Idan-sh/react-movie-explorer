/**
 * Movies Saga
 *
 * Handles side effects for movies module:
 * - Fetches movies from TMDB API
 * - Handles errors
 *
 * SAGA EFFECTS:
 * - takeLatest: Cancels previous fetch if new one starts (prevents race conditions)
 * - call: Calls async function and waits for result
 * - put: Dispatches Redux action
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tmdbClient } from '@/core/api';
import type { FetchMoviesPayload, TmdbMovieListResponse } from '../types';
import { getCategoryEndpoint } from '../utils';
import { fetchMovies, fetchMoviesSuccess, fetchMoviesFailure } from './movies.slice';

/**
 * Fetches movies from TMDB API
 */
function* fetchMoviesSaga(action: PayloadAction<FetchMoviesPayload>): Generator {
  try {
    const { category, page } = action.payload;
    const endpoint = getCategoryEndpoint(category);

    const response = yield call(tmdbClient.get<TmdbMovieListResponse>, endpoint, {
      params: { page },
    });

    const data = (response as { data: TmdbMovieListResponse }).data;

    yield put(
      fetchMoviesSuccess({
        movies: data.results,
        page: data.page,
        totalPages: data.total_pages,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movies';
    yield put(fetchMoviesFailure(message));
  }
}

/**
 * Root saga for movies module
 */
export function* moviesSaga(): Generator {
  yield takeLatest(fetchMovies.type, fetchMoviesSaga);
}
