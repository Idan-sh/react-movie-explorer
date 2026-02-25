/**
 * Navigation Module - Public API
 *
 * Provides keyboard navigation for the application.
 * Internal utils (grid math, focus helpers, resolvers) stay private.
 */

// Hooks
export { useKeyboardNav, usePageNavigation } from './hooks';

// Types
export type {
  ContentSection,
  UseKeyboardNavOptions,
  UseKeyboardNavReturn,
} from './types';
export type { UsePageNavigationOptions } from './hooks';

// Constants needed by components for data-nav-id attributes
export { GRID_COLUMNS, NAV_ID_PREFIX } from './constants';

// Utility for building nav IDs (used by CategoryTabs and MovieGrid)
export { buildNavId } from './utils';
