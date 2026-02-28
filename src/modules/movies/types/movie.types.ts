/**
 * Movie Types
 *
 * Based on TMDB API responses:
 * https://developer.themoviedb.org/reference/movie-popular-list
 * https://developer.themoviedb.org/reference/movie-details
 * https://developer.themoviedb.org/reference/movie-now-playing-list
 */

import { MOVIE_LIST } from "../constants";
import type { RequestStatus } from "@/shared/types";

/**
 * Movie object from TMDB API list endpoints (popular, now_playing)
 *
 * Fields exactly as returned from API.
 * Note: poster_path and backdrop_path can be null when no image exists.
 */
export interface TmdbMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids?: number[]; // present in list endpoints, absent in details endpoint
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * Cast member from TMDB /movie/{id}/credits
 */
export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

/**
 * Cast member with resolved profile URL for display (used by MovieDetailsCast).
 */
export interface CastMemberDisplay {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface MovieDetailsMetaDisplay {
  rating: number | null;
  year: string;
  runtime: string | null;
  budget: string | null;
  revenue: string | null;
}

export interface MovieDetailsCastDisplay {
  director: string | null;
  cast: CastMemberDisplay[];
}

export interface MovieDetailsDisplay {
  meta: MovieDetailsMetaDisplay;
  cast: MovieDetailsCastDisplay | null;
}

/**
 * Crew member from TMDB /movie/{id}/credits
 */
export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

/**
 * Video object from TMDB /movie/{id}/videos
 */
export interface TmdbVideo {
  id: string;
  key: string;
  site: string;
  type: string;
  name: string;
  official: boolean;
}

/**
 * Full movie detail response from TMDB /movie/{id}
 * Extends TmdbMovie — adds genres, runtime, tagline, status, budget, revenue,
 * and append_to_response data (credits, videos, recommendations).
 * Because it extends TmdbMovie it can be passed anywhere TmdbMovie is expected
 * (e.g. toggleFavorite), without any mapping.
 */
export interface TmdbMovieDetails extends TmdbMovie {
  tagline: string;
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
  status: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string | null;
  credits?: {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
  };
  videos?: {
    results: TmdbVideo[];
  };
  recommendations?: TmdbPaginatedResponse<TmdbMovie>;
}

/**
 * Paginated response wrapper from TMDB API
 */
export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Response from /movie/popular and /movie/now_playing endpoints
 */
export type TmdbMovieListResponse = TmdbPaginatedResponse<TmdbMovie>;

/**
 * Category filter type - derived from MOVIE_LIST constant values
 */
export type MovieList = (typeof MOVIE_LIST)[keyof typeof MOVIE_LIST];

/**
 * Redux state for the movie details page
 */
export interface MovieDetailsState {
  /** Full details from /movie/{id} — fetched when page mounts */
  details: TmdbMovieDetails | null;
  status: RequestStatus;
  error: string | null;
}
