import { all, fork } from 'redux-saga/effects';
import { moviesSaga, movieDetailsSaga } from '@/modules/movies/store';
import { searchSagaRoot } from '@/modules/search/store';

export function* rootSaga(): Generator {
  yield all([fork(moviesSaga), fork(movieDetailsSaga), fork(searchSagaRoot)]);
}
