/**
 * Application View Constants
 *
 * Controls which content is displayed on the homepage.
 * HOME = preview rows, others = full grid of that category.
 */

export const APP_VIEW = {
  HOME: 'home',
  POPULAR: 'popular',
  NOW_PLAYING: 'now_playing',
  FAVORITES: 'favorites',
} as const;

/**
 * Display labels for each view tab
 */
export const APP_VIEW_LABELS = {
  [APP_VIEW.HOME]: 'Home',
  [APP_VIEW.POPULAR]: 'Popular',
  [APP_VIEW.NOW_PLAYING]: 'Airing Now',
  [APP_VIEW.FAVORITES]: 'My Favorites',
} as const;

/**
 * Tabs shown in the header
 */
export const APP_VIEW_TABS = [
  APP_VIEW.HOME,
  APP_VIEW.POPULAR,
  APP_VIEW.NOW_PLAYING,
  APP_VIEW.FAVORITES,
] as const;
