/**
 * Navigation Module - Public API
 *
 * Provides keyboard navigation for the application.
 * Internal utils (grid math, focus helpers, resolvers) stay private.
 */

// Hooks
export { useKeyboardNav, usePageNavigation, useGridColumns } from './hooks';

// Types
export type {
  ContentSection,
  UseKeyboardNavOptions,
  UseKeyboardNavReturn,
} from './types';
export type { UsePageNavigationOptions } from './hooks';

// Constants needed by components for data-nav-id attributes and zone selection
export { NAV_ID_PREFIX, NAV_ZONE } from './constants';

// Utilities for building nav IDs and programmatic focus
export { buildNavId, focusNavElement } from './utils';
