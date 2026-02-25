/**
 * Movies Module - Public API
 *
 * Only exports what's needed outside this module.
 * Internal utilities, saga helpers, and internal types stay private.
 */

// Components: public components for pages
export { MovieCard, MovieGrid } from "./components";
export type { MovieCardProps, MovieGridProps } from "./components";

// Hooks: public hooks for pages
export { useMoviesInit } from "./hooks";
export type { UseMoviesInitReturn } from "./hooks";

// Store: reducer and saga for root store
export { moviesReducer, moviesSaga } from "./store";

// Store: public actions for components
export { fetchMovies, resetMovies } from "./store";

// Store: selectors for components
export { getListSelectors } from "./store";

// Types: public types for components
export type { TmdbMovie, MovieList } from "./types";

// Constants: public constants for components
export { MOVIE_LIST, TMDB_IMAGE, PAGINATION } from "./constants";
