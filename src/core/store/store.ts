/** Redux store with saga middleware for async flows. */

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { env } from '../config';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import { listenerMiddleware } from './listenerMiddleware';
import '@/modules/favorites/store/favorites.listener';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(sagaMiddleware),
  devTools: env.isDev,
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
