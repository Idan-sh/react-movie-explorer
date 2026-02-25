/**
 * useCategoryTabs Hook
 *
 * Manages category tab state and interaction handlers.
 *
 * BEHAVIOR (per requirements):
 * - Click → switch view immediately
 * - Focus after 2 seconds → switch view (auto-fetch)
 * - Blur → cancel pending focus timer
 */

import { useState, useCallback, useRef } from 'react';
import { APP_VIEW } from '@/shared/constants';
import type { AppView } from '@/shared/types';

const FOCUS_DELAY_MS = 2000;

export interface UseCategoryTabsReturn {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  handleTabFocus: (view: AppView) => void;
  handleTabBlur: () => void;
}

/**
 * Hook that manages category tab navigation.
 */
export function useCategoryTabs(): UseCategoryTabsReturn {
  const [activeView, setActiveView] = useState<AppView>(APP_VIEW.HOME);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFocusTimer = (): void => {
    if (focusTimerRef.current !== null) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  };

  // Click → switch view immediately
  const handleTabClick = useCallback((view: AppView): void => {
    clearFocusTimer();
    setActiveView(view);
  }, []);

  // Focus → switch view after delay (non-home tabs only)
  const handleTabFocus = useCallback((view: AppView): void => {
    if (view === APP_VIEW.HOME) return;
    clearFocusTimer();
    focusTimerRef.current = setTimeout(() => {
      setActiveView(view);
    }, FOCUS_DELAY_MS);
  }, []);

  // Blur → cancel pending timer
  const handleTabBlur = useCallback((): void => {
    clearFocusTimer();
  }, []);

  return {
    activeView,
    handleTabClick,
    handleTabFocus,
    handleTabBlur,
  };
}
