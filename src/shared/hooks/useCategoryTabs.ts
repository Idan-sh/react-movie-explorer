/**
 * useCategoryTabs Hook
 *
 * Manages category tab state and interaction handlers.
 * Persists active view to sessionStorage so it survives page refresh.
 *
 * BEHAVIOR (per requirements):
 * - Click → switch view immediately
 * - Focus after 2 seconds → switch view (auto-fetch)
 * - Blur → cancel pending focus timer
 */

import { useState, useCallback, useRef } from 'react';
import {
  APP_VIEW_DEFAULT,
  APP_VIEW_TABS,
  STORAGE_KEY,
} from '@/shared/constants';
import { getSessionItem, setSessionItem } from '@/shared/utils';
import type { AppView } from '@/shared/types';

const FOCUS_DELAY_MS = 2000;

function loadActiveView(): AppView {
  const stored = getSessionItem(STORAGE_KEY.NAV.ACTIVE_VIEW);
  if (stored && APP_VIEW_TABS.includes(stored as AppView)) {
    return stored as AppView;
  }
  return APP_VIEW_DEFAULT;
}

export interface UseCategoryTabsReturn {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  handleTabFocus: (view: AppView) => void;
  handleTabBlur: () => void;
}

export function useCategoryTabs(
  scrollRef: React.RefObject<HTMLElement | null>,
): UseCategoryTabsReturn {
  const [activeView, setActiveView] = useState<AppView>(loadActiveView);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFocusTimer = (): void => {
    if (focusTimerRef.current !== null) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  };

  const handleTabClick = useCallback(
    (view: AppView): void => {
      clearFocusTimer();
      const isSameView = view === activeView;
      setActiveView(view);
      setSessionItem(STORAGE_KEY.NAV.ACTIVE_VIEW, view);
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: isSameView ? 'smooth' : 'instant',
      });
    },
    [activeView, scrollRef],
  );

  const handleTabFocus = useCallback((view: AppView): void => {
    clearFocusTimer();
    focusTimerRef.current = setTimeout(() => {
      setActiveView(view);
      setSessionItem(STORAGE_KEY.NAV.ACTIVE_VIEW, view);
    }, FOCUS_DELAY_MS);
  }, []);

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
