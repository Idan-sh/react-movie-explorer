/**
 * MovieCard Utilities
 *
 * Pure functions for transforming TMDB movie data for display.
 * No React dependencies - easily testable in isolation.
 */

import { TMDB_IMAGE } from '../constants';

/**
 * Constructs the full poster URL from TMDB path
 * @param posterPath - TMDB poster path (e.g., "/abc123.jpg") or null
 * @returns Full CDN URL or null if no path
 */
export function getPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.POSTER_SIZES.MEDIUM}${posterPath}`;
}

/**
 * Extracts year from TMDB date string
 * @param releaseDate - TMDB date format (YYYY-MM-DD)
 * @returns Year string or 'N/A' if invalid
 */
export function getReleaseYear(releaseDate: string): string {
  if (!releaseDate) return 'N/A';
  return releaseDate.split('-')[0];
}

/**
 * Converts TMDB vote average (0–10) to a percentage (0–100)
 * @param voteAverage - Raw vote average (0-10)
 * @returns Percentage number or null for unrated movies
 */
export function formatRating(voteAverage: number): number | null {
  if (!voteAverage) return null;
  return Math.round(voteAverage * 10);
}

/**
 * Constructs the full backdrop URL from TMDB path
 * @param backdropPath - TMDB backdrop path or null
 * @returns Full CDN URL or null if no path
 */
export function getBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.BACKDROP_SIZES.MEDIUM}${backdropPath}`;
}

/**
 * Formats runtime minutes into a human-readable string (e.g. "2h 15m")
 * @param minutes - Runtime in minutes, or null
 * @returns Formatted string or null if no runtime
 */
export function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Builds accessible aria-label for movie card
 * @param title - Movie title
 * @param releaseYear - Formatted release year
 * @param rating - Formatted rating
 * @returns Aria-label string
 */
export function buildMovieAriaLabel(
  title: string,
  releaseYear: string,
  rating: number | null
): string {
  const ratingText = rating !== null ? `Rating: ${rating}%` : 'No rating available';
  return `${title}, ${releaseYear}, ${ratingText}`;
}
