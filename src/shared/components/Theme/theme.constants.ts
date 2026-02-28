/**
 * Theme Constants
 *
 * Centralized definition for the app's color mode system.
 * Add new modes here — the rest of the system derives from these values.
 */

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export const THEME_DEFAULT = THEME.DARK;

export const THEME_CSS_CLASS = THEME.DARK;
