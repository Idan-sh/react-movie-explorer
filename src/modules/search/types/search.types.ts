/**
 * Search Types
 *
 * State and payload types for the search Redux slice.
 */

import type { RequestStatus } from '@/shared/types';
import type { TmdbMovie } from '@/modules/movies';

export interface SearchState {
  query: string;
  results: TmdbMovie[];
  page: number;
  totalPages: number;
  status: RequestStatus;
  error: string | null;
}

export interface SearchSuccessPayload {
  results: TmdbMovie[];
  page: number;
  totalPages: number;
}

export interface SearchFailurePayload {
  error: string;
}
