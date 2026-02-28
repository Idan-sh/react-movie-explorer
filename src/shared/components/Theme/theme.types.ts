/**
 * Theme value derived from THEME constants (e.g. "light" | "dark").
 */
import type { THEME } from './theme.constants';

export type Theme = (typeof THEME)[keyof typeof THEME];
