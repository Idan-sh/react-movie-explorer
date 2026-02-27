/**
 * Movies Module - Public API
 *
 * Only exports what's needed outside this module.
 * Internal utilities, saga helpers, and internal types stay private.
 */

// Components: public components for pages
export { MovieCard, MovieGrid, MovieGridLayout, MovieDetails } from "./components";
export type { MovieCardProps, MovieGridProps, MovieGridLayoutProps } from "./components";

// Hooks: public hooks for pages
export { useMoviesInit, useMovieDetails } from "./hooks";
export type { UseMoviesInitReturn } from "./hooks";

// Store: reducers and sagas for root store
export { moviesReducer, moviesSaga, movieDetailsReducer, movieDetailsSaga } from "./store";

// Store: public actions
export { fetchMovies, resetMovies, fetchMovieDetails, clearMovieDetails, showNextPage } from "./store";

// Store: public selectors
export { getListSelectors, selectMovieDetails, selectDetailsIsLoading, selectDetailsError } from "./store";

// Types: public types for components
export type { TmdbMovie, TmdbMovieDetails, MovieList, MovieGridState } from "./types";

// Constants: public constants for components
export { MOVIE_LIST, TMDB_IMAGE, PAGINATION } from "./constants";
