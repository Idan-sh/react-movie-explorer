/**
 * useMovieCard Hook
 *
 * Transforms raw TMDB movie data into display-ready values.
 * Provides click handlers for user interactions.
 *
 * Enter key is handled globally by useKeyboardNav — no onKeyDown here.
 */

import type { TmdbMovie } from '../types';
import {
  getPosterUrl,
  formatReleaseDate,
  formatRating,
  buildMovieAriaLabel,
  fireFavoriteConfetti,
} from '../utils';

export interface MovieCardData {
  posterUrl: string | null;
  releaseDate: string;
  rating: number | null;
  title: string;
  ariaLabel: string;
  handleClick: () => void;
  handleToggleFavorite: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function useMovieCard(
  movie: TmdbMovie,
  onSelect?: (movie: TmdbMovie) => void,
  onToggleFavorite?: (movie: TmdbMovie) => void,
  isFavorited = false,
): MovieCardData {
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseDate = formatReleaseDate(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const ariaLabel = buildMovieAriaLabel(movie.title, releaseDate, rating);

  const handleClick = (): void => {
    onSelect?.(movie);
  };

  const handleToggleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    fireFavoriteConfetti(e.currentTarget, !isFavorited);
    onToggleFavorite?.(movie);
  };

  return {
    posterUrl,
    releaseDate,
    rating,
    title: movie.title,
    ariaLabel,
    handleClick,
    handleToggleFavorite,
  };
}
