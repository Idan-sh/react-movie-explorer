/**
 * Movies Module - Public API
 *
 * Only exports what's needed outside this module.
 * Internal utilities, saga helpers, and internal types stay private.
 */

// Components: public components for pages
export {
  MovieCard,
  MovieGrid,
  MovieGridLayout,
  MovieDetailsBackdrop,
  MovieDetailsPoster,
  MovieDetailsMeta,
  MovieDetailsGenres,
  MovieDetailsOverview,
  MovieDetailsCast,
  MovieDetailsTrailer,
  MovieDetailsRecommendations,
  FavoriteToggleButton
} from "./components";
export type {
  MovieCardProps,
  MovieGridProps,
  MovieGridLayoutProps,
  MovieDetailsMetaProps,
  MovieDetailsCastProps
} from "./components";

// Hooks: public hooks for pages
export { useMoviesInit, useMovieDetailsPage, useHomePage } from "./hooks";
export type {
  UseMoviesInitReturn,
  MovieDetailsDisplay,
  MovieDetailsMetaDisplay,
  MovieDetailsCastDisplay
} from "./hooks";

// Utils: public for pages (e.g. getBackdropUrl for MovieDetailsPage)
export { getBackdropUrl } from "./utils";

// Store: reducers and sagas for root store
export { moviesReducer, moviesSaga, movieDetailsReducer, movieDetailsSaga } from "./store";

// Store: public actions
export {
  fetchMovies,
  resetMovies,
  fetchMovieDetails,
  clearMovieDetails,
  showNextPage
} from "./store";

// Store: public selectors
export {
  getListSelectors,
  selectMovieDetails,
  selectDetailsIsLoading,
  selectDetailsError
} from "./store";

// Types: public types for components
export type { TmdbMovie, TmdbMovieDetails, MovieList, MovieGridState } from "./types";

// Constants: public constants for components
export { MOVIE_LIST, TMDB_IMAGE, PAGINATION } from "./constants";
