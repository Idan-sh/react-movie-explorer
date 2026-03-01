/**
 * Root Saga
 *
 * Combines all feature sagas into a single root saga.
 *
 * HOW SAGAS WORK:
 * - Sagas are generator functions that "watch" for actions
 * - When action dispatched, saga runs side effects (API calls, etc.)
 * - Saga dispatches new actions with results
 *
 * EXAMPLE FLOW:
 * 1. Component: dispatch(fetchMovies())
 * 2. Saga: watches for 'movies/fetchMovies' action
 * 3. Saga: calls API, waits for response
 * 4. Saga: dispatch(fetchMoviesSuccess(data)) or fetchMoviesFailure(error)
 * 5. Reducer: updates state with data
 * 6. Component: re-renders with new state
 *
 * ADDING A NEW SAGA:
 * 1. Create saga in module: modules/example/store/example.saga.ts
 * 2. Import and add to the 'all' effect below
 */

import { all, fork } from 'redux-saga/effects';
import { moviesSaga, movieDetailsSaga } from '@/modules/movies/store';
import { searchSagaRoot } from '@/modules/search/store';

/**
 * Root saga that forks all feature sagas
 *
 * WHY 'fork':
 * - fork() runs sagas in parallel (non-blocking)
 * - all() waits for all forks to complete (they run forever, watching)
 */
export function* rootSaga(): Generator {
  yield all([fork(moviesSaga), fork(movieDetailsSaga), fork(searchSagaRoot)]);
}
