/**
 * Application entry point
 *
 * SETUP:
 * - StrictMode: Highlights potential problems in development
 * - Provider: Makes Redux store available to all components
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/core/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
