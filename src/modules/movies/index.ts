/**
 * Movies Module - Public API
 *
 * Only exports what's needed outside this module.
 * Internal utilities, saga helpers, and internal types stay private.
 */

// Store: reducer and saga for root store
export { moviesReducer, moviesSaga } from "./store";

// Store: public actions for components
export { fetchMovies, setCategory, resetMovies } from "./store";

// Store: selectors for components
export {
  selectMovies,
  selectCategory,
  selectPage,
  selectTotalPages,
  selectIsLoading,
  selectHasError,
  selectHasMorePages,
  selectError
} from "./store";

// Types: public types for components
export type { TmdbMovie, MovieCategory } from "./types";

// Constants: public constants for components
export { MOVIE_CATEGORY, TMDB_IMAGE } from "./constants";
