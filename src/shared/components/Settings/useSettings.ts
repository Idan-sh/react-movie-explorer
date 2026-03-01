/**
 * useSettings Hook
 *
 * Manages app-level settings persisted in localStorage.
 * Currently supports: mouse scroll enable/disable.
 */

import { useState, useCallback } from 'react';
import { loadScrollEnabled, saveScrollEnabled } from './settings.storage';

export interface UseSettingsReturn {
  isScrollEnabled: boolean;
  toggleScroll: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [isScrollEnabled, setIsScrollEnabled] = useState(loadScrollEnabled);

  const toggleScroll = useCallback((): void => {
    setIsScrollEnabled((prev) => {
      const next = !prev;
      saveScrollEnabled(next);
      return next;
    });
  }, []);

  return { isScrollEnabled, toggleScroll };
}
