/**
 * Request Types
 *
 * Types for async operation states.
 * Derived from constants in shared/constants/request.constants.ts
 */

import { REQUEST_STATUS } from '../constants';

/**
 * Status type for async requests
 */
export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
