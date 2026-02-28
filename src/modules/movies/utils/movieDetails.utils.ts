/**
 * Movie Details Utilities
 *
 * Pure functions for transforming TMDB movie detail data for display.
 * Handles credits, videos, and financial data.
 */

import { TMDB_IMAGE } from '../constants';
import type { TmdbCrewMember, TmdbVideo } from '../types';

/**
 * Constructs the full profile image URL from TMDB path
 * @param profilePath - TMDB profile path or null
 * @returns Full CDN URL or null if no path
 */
export function getProfileUrl(profilePath: string | null): string | null {
  if (!profilePath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.PROFILE_SIZES.MEDIUM}${profilePath}`;
}

/**
 * Formats a monetary amount to a compact string (e.g. $63M, $850K, $200)
 * @param amount - Raw amount in dollars
 * @returns Formatted string or null if amount is 0 / falsy
 */
export function formatMoney(amount: number): string | null {
  if (!amount) return null;
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

/**
 * Finds the director from a crew array
 * @param crew - TMDB crew array
 * @returns Director name or null
 */
export function getDirector(crew: TmdbCrewMember[]): string | null {
  const director = crew.find((member) => member.job === 'Director');
  return director?.name ?? null;
}

/**
 * Finds the best YouTube trailer from a videos array.
 * Prefers official trailers, falls back to any YouTube trailer, then any YouTube video.
 * @param videos - TMDB video results array
 * @returns Best video object or null
 */
export function getTrailer(videos: TmdbVideo[]): TmdbVideo | null {
  const youtubeVideos = videos.filter((v) => v.site === 'YouTube');
  if (youtubeVideos.length === 0) return null;

  const officialTrailer = youtubeVideos.find((v) => v.type === 'Trailer' && v.official);
  if (officialTrailer) return officialTrailer;

  const anyTrailer = youtubeVideos.find((v) => v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  return youtubeVideos[0];
}

/**
 * Constructs a YouTube thumbnail URL from a video key
 * Uses mqdefault (320x180) for good quality at reasonable size
 */
export function getYoutubeThumbnailUrl(key: string): string {
  return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
}
