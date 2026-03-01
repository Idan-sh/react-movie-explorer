/**
 * Application View Constants
 *
 * Controls which content is displayed.
 * Each view corresponds to a tab with its own content grid.
 */

export const APP_VIEW = {
  POPULAR: 'popular',
  NOW_PLAYING: 'now_playing',
  FAVORITES: 'favorites',
} as const;

/**
 * Per-view display config: tab label + page title.
 * Single source of truth — add new fields here as needed.
 */
export const APP_VIEW_CONFIG = {
  [APP_VIEW.POPULAR]: { label: 'Popular', title: 'Popular Movies' },
  [APP_VIEW.NOW_PLAYING]: { label: 'Airing Now', title: 'Movies Airing Now' },
  [APP_VIEW.FAVORITES]: { label: 'My Favorites', title: 'My Favorite Movies' },
} as const;

/**
 * Default view on app load
 */
export const APP_VIEW_DEFAULT = APP_VIEW.POPULAR;

/**
 * Tabs shown in the header
 */
export const APP_VIEW_TABS = [
  APP_VIEW.POPULAR,
  APP_VIEW.NOW_PLAYING,
  APP_VIEW.FAVORITES,
] as const;

/** Tab index for the hamburger button (hidden on desktop, auto-skipped by nav) */
export const HAMBURGER_TAB_INDEX = APP_VIEW_TABS.length + 3;

/** Total navigable tab slots in the header (category tabs + search + theme + settings + hamburger) */
export const HEADER_NAV_COUNT = HAMBURGER_TAB_INDEX + 1;
