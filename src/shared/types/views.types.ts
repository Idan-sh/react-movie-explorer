/**
 * View Types
 *
 * Derived from APP_VIEW constants.
 */

import { APP_VIEW } from '../constants';

/**
 * All possible app views
 */
export type AppView = (typeof APP_VIEW)[keyof typeof APP_VIEW];
