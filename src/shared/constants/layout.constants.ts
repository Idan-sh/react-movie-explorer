/**
 * Layout Constants
 *
 * Breakpoint values matching Tailwind CSS defaults.
 * Used by hooks and utilities that need JS-side breakpoint awareness.
 */

export const BREAKPOINT = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Z-Index Layers
 *
 * Centralized stacking order for global UI layers.
 * Ordered bottom → top. Gaps between values leave room for future layers.
 *
 * NOTE: Component-local z-indices (e.g., FavoriteButton inside a card)
 * live in their own stacking context and are NOT listed here.
 */
export const Z_LAYER = {
  CONTENT: 0,
  SCROLL_TO_TOP: 15,
  HEADER: 20,
  MOBILE_MENU: 25,
  DROPDOWN: 28,
  MODAL: 30,
  TOAST: 40,
} as const;
