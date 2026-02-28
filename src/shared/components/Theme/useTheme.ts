/**
 * useTheme Hook
 *
 * Manages light/dark theme state.
 * Persists choice to localStorage and syncs the CSS class on <html>.
 * Defaults to THEME_DEFAULT when no stored preference exists.
 */

import { useState, useCallback } from 'react';
import { STORAGE_KEY } from '@/shared/constants';
import { THEME, THEME_DEFAULT, THEME_CSS_CLASS } from './theme.constants';
import type { Theme } from './theme.types';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY.THEME);
  if (stored === THEME.LIGHT || stored === THEME.DARK) return stored;
  return THEME_DEFAULT;
}

function applyTheme(theme: Theme): void {
  if (theme === THEME.DARK) {
    document.documentElement.classList.add(THEME_CSS_CLASS);
  } else {
    document.documentElement.classList.remove(THEME_CSS_CLASS);
  }
  localStorage.setItem(STORAGE_KEY.THEME, theme);
}

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = useCallback((): void => {
    setTheme((prev) => {
      const next = prev === THEME.DARK ? THEME.LIGHT : THEME.DARK;
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, isDark: theme === THEME.DARK, toggleTheme };
}
