/**
 * Movies Module Constants
 */

/**
 * Movie category values
 * Used for filtering between Popular and Now Playing
 */
export const MOVIE_CATEGORY = {
  POPULAR: 'popular',
  NOW_PLAYING: 'now_playing',
} as const;

/**
 * TMDB image CDN configuration
 */
export const TMDB_IMAGE = {
  BASE_URL: 'https://image.tmdb.org/t/p',

  POSTER_SIZES: {
    SMALL: 'w185',
    MEDIUM: 'w342',
    LARGE: 'w500',
    ORIGINAL: 'original',
  },

  BACKDROP_SIZES: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20, // TMDB returns 20 items per page
} as const;
