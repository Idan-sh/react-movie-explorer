/**
 * useMovieCard Hook
 *
 * Transforms raw TMDB movie data into display-ready values.
 * Provides event handlers for user interactions.
 */

import { useCallback } from 'react';
import type { TmdbMovie } from '../types';
import {
  getPosterUrl,
  getReleaseYear,
  formatRating,
  buildMovieAriaLabel,
} from '../utils';

export interface MovieCardData {
  posterUrl: string | null;
  releaseYear: string;
  rating: string;
  title: string;
  ariaLabel: string;
}

export interface MovieCardHandlers {
  handleClick: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export interface UseMovieCardReturn extends MovieCardData, MovieCardHandlers {}

/**
 * Hook that transforms TMDB movie data and provides interaction handlers.
 *
 * @param movie - TMDB movie object
 * @param onSelect - Optional callback when movie is selected (click/Enter)
 */
export function useMovieCard(
  movie: TmdbMovie,
  onSelect?: (movie: TmdbMovie) => void
): UseMovieCardReturn {
  // Data transformations (trivial - no memoization needed)
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = getReleaseYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const ariaLabel = buildMovieAriaLabel(movie.title, releaseYear, rating);

  // Event handlers
  const handleClick = useCallback((): void => {
    onSelect?.(movie);
  }, [movie, onSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSelect?.(movie);
    }
  }, [movie, onSelect]);

  return {
    posterUrl,
    releaseYear,
    rating,
    title: movie.title,
    ariaLabel,
    handleClick,
    handleKeyDown,
  };
}
