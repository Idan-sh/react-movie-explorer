/**
 * Application entry point
 *
 * SETUP:
 * - StrictMode: Highlights potential problems in development
 * - Provider: Makes Redux store available to all components
 * - BrowserRouter + Routes: Client-side routing
 *
 * Both pages are lazy-loaded so each route only downloads its code on demand.
 */

import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/core/store';
import { ROUTES } from '@/shared/constants';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.MOVIE_DETAILS} element={<MovieDetailsPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
