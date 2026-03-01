/**
 * Pure functions for transforming TMDB movie detail data for display.
 */

import { TMDB_IMAGE } from '../constants';
import type { TmdbCrewMember, TmdbVideo } from '../types';

export function getProfileUrl(profilePath: string | null): string | null {
  if (!profilePath) return null;
  return `${TMDB_IMAGE.BASE_URL}/${TMDB_IMAGE.PROFILE_SIZES.MEDIUM}${profilePath}`;
}

export function formatMoney(amount: number): string | null {
  if (!amount) return null;
  if (amount >= 1_000_000_000)
    return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function getDirector(crew: TmdbCrewMember[]): string | null {
  const director = crew.find((member) => member.job === 'Director');
  return director?.name ?? null;
}

/** Prefers official trailers, falls back to any YouTube trailer, then any YouTube video. */
export function getTrailer(videos: TmdbVideo[]): TmdbVideo | null {
  const youtubeVideos = videos.filter((v) => v.site === 'YouTube');
  if (youtubeVideos.length === 0) return null;

  const officialTrailer = youtubeVideos.find(
    (v) => v.type === 'Trailer' && v.official,
  );
  if (officialTrailer) return officialTrailer;

  const anyTrailer = youtubeVideos.find((v) => v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  return youtubeVideos[0];
}

/** Uses mqdefault (320x180) for good quality at reasonable size. */
export function getYoutubeThumbnailUrl(key: string): string {
  return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
}
