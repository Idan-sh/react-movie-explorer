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
 * Display labels for each view tab
 */
export const APP_VIEW_LABELS = {
  [APP_VIEW.POPULAR]: 'Popular',
  [APP_VIEW.NOW_PLAYING]: 'Airing Now',
  [APP_VIEW.FAVORITES]: 'My Favorites',
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
