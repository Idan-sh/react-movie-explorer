/**
 * Request Constants
 *
 * Status values for async operations (API calls).
 * Used across all modules for consistent loading state handling.
 *
 * Type: see shared/types/request.types.ts
 */

export const REQUEST_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
