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

import { useState, useCallback, useRef } from "react";
import { APP_VIEW_DEFAULT } from "@/shared/constants";
import type { AppView } from "@/shared/types";

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
  const [activeView, setActiveView] = useState<AppView>(APP_VIEW_DEFAULT);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFocusTimer = (): void => {
    if (focusTimerRef.current !== null) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  };

  // Click → switch view immediately + scroll content to top
  // Same tab: smooth scroll back to top. Different tab: instant reset.
  const handleTabClick = useCallback(
    (view: AppView): void => {
      clearFocusTimer();
      const isSameView = view === activeView;
      setActiveView(view);
      document
        .querySelector("main")
        ?.scrollTo({ top: 0, behavior: isSameView ? "smooth" : "instant" });
    },
    [activeView]
  );

  // Focus → switch view after delay
  const handleTabFocus = useCallback((view: AppView): void => {
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
    handleTabBlur
  };
}
