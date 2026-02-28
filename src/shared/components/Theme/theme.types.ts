import type { THEME } from './theme.constants';

export type Theme = (typeof THEME)[keyof typeof THEME];
