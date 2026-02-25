/**
 * View Types
 *
 * Derived from APP_VIEW constants.
 */

import { APP_VIEW } from '../constants';

/**
 * All possible app views (home + category tabs)
 */
export type AppView = (typeof APP_VIEW)[keyof typeof APP_VIEW];

/**
 * Tab views only (excludes home)
 */
export type AppViewTab = Exclude<AppView, typeof APP_VIEW.HOME>;
