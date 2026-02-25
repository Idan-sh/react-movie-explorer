/**
 * useCategoryTabs Hook
 *
 * Manages category tab state and interaction handlers.
 *
 * BEHAVIOR (per requirements):
 * - Click → switch view immediately
 * - Focus after 2 seconds → switch view (auto-fetch)
 * - Blur → cancel pending focus timer
 * - Clicking active tab → return to home view
 */

import { useState, useCallback, useRef } from 'react';
import { APP_VIEW } from '@/shared/constants';
import type { AppView, AppViewTab } from '@/shared/types';

const FOCUS_DELAY_MS = 2000;

export interface UseCategoryTabsReturn {
  activeView: AppView;
  handleTabClick: (view: AppViewTab) => void;
  handleTabFocus: (view: AppViewTab) => void;
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

  // Click → toggle view immediately (click again to return home)
  const handleTabClick = useCallback((view: AppViewTab): void => {
    clearFocusTimer();
    setActiveView((current) => (current === view ? APP_VIEW.HOME : view));
  }, []);

  // Focus → switch view after delay
  const handleTabFocus = useCallback((view: AppViewTab): void => {
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
