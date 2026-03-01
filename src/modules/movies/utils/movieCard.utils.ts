/**
 * Pure functions for transforming TMDB movie data for display.
 * No React dependencies - easily testable in isolation.
 */

import { TMDB_IMAGE, RATING } from '../constants';

export function getPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.POSTER_SIZES.MEDIUM}${posterPath}`;
}

export function getReleaseYear(releaseDate: string): string {
  if (!releaseDate) return 'N/A';
  return releaseDate.split('-')[0];
}

export function formatReleaseDate(releaseDate: string): string {
  if (!releaseDate) return 'N/A';
  const [year, month, day] = releaseDate.split('-');
  if (!year || !month || !day) return 'N/A';
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRating(voteAverage: number, voteCount: number): number | null {
  if (voteAverage <= 0 || voteCount < RATING.MIN_VOTE_COUNT) return null;
  return Math.round(voteAverage * 10);
}

export function getBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.BACKDROP_SIZES.MEDIUM}${backdropPath}`;
}

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function buildMovieAriaLabel(
  title: string,
  releaseYear: string,
  rating: number | null,
): string {
  const ratingText =
    rating !== null ? `Rating: ${rating}%` : 'No rating available';
  return `${title}, ${releaseYear}, ${ratingText}`;
}
