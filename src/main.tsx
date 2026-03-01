/**
 * Application entry point
 *
 * SETUP:
 * - StrictMode: Highlights potential problems in development
 * - Provider: Makes Redux store available to all components
 * - Data router (createBrowserRouter): Enables viewTransition for smooth page transitions
 *
 * Both pages are lazy-loaded so each route only downloads its code on demand.
 */

import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/core/store';
import { ROUTES } from '@/shared/constants';
import {
  AppLayout,
  PageSpinner,
  RouteErrorFallback,
} from '@/shared/components';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <Suspense fallback={<PageSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.MOVIE_DETAILS,
        element: (
          <Suspense fallback={<PageSpinner />}>
            <MovieDetailsPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
