export {
  moviesReducer,
  fetchMovies,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  prefetchSuccess,
  showNextPage,
  resetMovies,
} from './movies.slice';
export { moviesSaga } from './movies.saga';
export * from './movies.selectors';

export {
  movieDetailsReducer,
  fetchMovieDetails,
  clearMovieDetails,
  fetchDetailsSuccess,
  fetchDetailsFailure,
} from './movieDetails.slice';
export { movieDetailsSaga } from './movieDetails.saga';
export * from './movieDetails.selectors';
