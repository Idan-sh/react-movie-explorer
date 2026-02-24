/**
 * Redux Store Configuration
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │                      Component                          │
 * │                         │                               │
 * │                    dispatch(action)                     │
 * │                         ▼                               │
 * │  ┌─────────────────────────────────────────────────┐   │
 * │  │                  Redux Store                     │   │
 * │  │                      │                           │   │
 * │  │         ┌────────────┴────────────┐             │   │
 * │  │         ▼                         ▼             │   │
 * │  │    Reducer (sync)           Saga (async)        │   │
 * │  │    updates state            API calls           │   │
 * │  │         │                         │             │   │
 * │  │         ▼                         ▼             │   │
 * │  │    New State              dispatch(result)      │   │
 * │  └─────────────────────────────────────────────────┘   │
 * │                         │                               │
 * │                    useSelector()                        │
 * │                         ▼                               │
 * │                   Re-render                             │
 * └─────────────────────────────────────────────────────────┘
 *
 * WHY REDUX-SAGA:
 * - Complex async flows (debounce, rate limit, cancellation)
 * - Testable side effects (generators are easy to test)
 * - Powerful effects (takeLatest, race, all, etc.)
 */

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for saga actions if needed
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
