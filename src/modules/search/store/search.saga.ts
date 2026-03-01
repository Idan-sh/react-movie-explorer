/**
 * Search Saga
 *
 * Handles side effects for the search module:
 * - Debounces query changes (500ms) before firing API calls
 * - Enforces rate limiting (max 5 requests per 10 seconds)
 * - Skips queries shorter than the minimum length
 * - Handles pagination via loadMoreSearchResults action
 */

import { call, put, select, takeLatest, debounce as sagaDebounce } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import { tmdbClient, TMDB_ENDPOINTS } from '@/core/api';
import { createRateLimiter } from '@/shared/utils';
import type { TmdbMovieListResponse } from '@/modules/movies/types';
import { SEARCH } from '../constants';
import {
  setSearchQuery,
  searchMoviesStart,
  searchMoviesSuccess,
  searchMoviesFailure,
  loadMoreSearchResults,
} from './search.slice';
import {
  selectSearchQuery,
  selectSearchPage,
  selectSearchHasMorePages,
} from './search.selectors';

const rateLimiter = createRateLimiter(SEARCH.RATE_LIMIT_MAX, SEARCH.RATE_LIMIT_WINDOW_MS);

function* fetchPage(query: string, page: number): Generator {
  const response = yield call(tmdbClient.get<TmdbMovieListResponse>, TMDB_ENDPOINTS.SEARCH.MOVIES, {
    params: { query, page },
  });
  const { results, page: resultPage, total_pages } = (response as AxiosResponse<TmdbMovieListResponse>).data;
  yield put(searchMoviesSuccess({ results, page: resultPage, totalPages: total_pages }));
}

const RATE_LIMIT_MESSAGE = 'Too many searches. Please wait a moment.';

function* searchSaga(action: PayloadAction<string>): Generator {
  const query = action.payload.trim();
  if (query.length < SEARCH.MIN_QUERY_LENGTH) return;

  if (!rateLimiter.canRequest()) {
    yield put(searchMoviesFailure({ error: RATE_LIMIT_MESSAGE }));
    return;
  }

  yield put(searchMoviesStart());

  try {
    yield* fetchPage(query, 1);
    rateLimiter.record();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    yield put(searchMoviesFailure({ error: message }));
  }
}

function* loadMoreSaga(): Generator {
  const query = (yield select(selectSearchQuery)) as string;
  const page = (yield select(selectSearchPage)) as number;
  const hasMorePages = (yield select(selectSearchHasMorePages)) as boolean;

  if (!hasMorePages || query.trim().length < SEARCH.MIN_QUERY_LENGTH) return;

  if (!rateLimiter.canRequest()) {
    yield put(searchMoviesFailure({ error: RATE_LIMIT_MESSAGE }));
    return;
  }

  yield put(searchMoviesStart());

  try {
    yield* fetchPage(query, page + 1);
    rateLimiter.record();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    yield put(searchMoviesFailure({ error: message }));
  }
}

export function* searchSagaRoot(): Generator {
  yield sagaDebounce(SEARCH.DEBOUNCE_MS, setSearchQuery.type, searchSaga);
  yield takeLatest(loadMoreSearchResults.type, loadMoreSaga);
}
