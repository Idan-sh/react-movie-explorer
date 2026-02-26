/**
 * Navigation Constants
 *
 * Key codes for keyboard navigation, zone identifiers,
 * and grid configuration.
 */

/**
 * Keyboard keys used for navigation
 */
export const NAV_KEY = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
} as const;

/**
 * Navigation zones - logical areas the user can navigate between
 */
export const NAV_ZONE = {
  TABS: 'tabs',
  CONTENT: 'content',
} as const;

/**
 * Prefixes for data-nav-id attributes on DOM elements.
 * Used to programmatically move focus to the correct element.
 */
export const NAV_ID_PREFIX = {
  TAB: 'nav-tab',
  ITEM: 'nav-item',
} as const;
