export const MOVIE_LIST = {
  POPULAR: 'popular',
  NOW_PLAYING: 'now_playing',
} as const;

export const MOVIE_LIST_STATE_KEY = {
  [MOVIE_LIST.POPULAR]: 'popular',
  [MOVIE_LIST.NOW_PLAYING]: 'nowPlaying',
} as const;

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

  PROFILE_SIZES: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'h632',
    ORIGINAL: 'original',
  },
} as const;

export const RATING = {
  MIN_VOTE_COUNT: 10,
} as const;

export const CAST = {
  MAX_DISPLAY: 8,
} as const;

/** Extra data appended to the movie details API call via append_to_response. */
export const MOVIE_DETAILS_APPEND = 'credits,videos,recommendations';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20,
} as const;
