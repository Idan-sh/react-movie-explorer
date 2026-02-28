/**
 * useLoadMore Hook (shared)
 *
 * Generic load-more with scroll-to-new-content behavior.
 * Callers pass their own selectors for itemCount and canLoad,
 * plus an onLoad callback with source-specific dispatch logic.
 *
 * After new items render, the first new card scrolls smoothly into view.
 * Deferred by one frame to run after useKeyboardNav's DOM focus sync.
 */

import { useCallback, useRef, useEffect } from "react";
import { useAppSelector } from "@/core/store";
import { buildNavId, NAV_ID_PREFIX } from "@/core/navigation";
import type { RootState } from "@/core/store";

export interface UseLoadMoreOptions {
  /** Selector returning the current item count (used as scroll anchor) */
  itemCountSelector: (state: RootState) => number;
  /** Selector returning whether a next page is available and not loading */
  canLoadSelector: (state: RootState) => boolean;
  /** Source-specific dispatch call — invoked only when canLoad is true */
  onLoad: () => void;
  sectionIndex?: number;
}

export function useLoadMore({
  itemCountSelector,
  canLoadSelector,
  onLoad,
  sectionIndex = 0
}: UseLoadMoreOptions): () => void {
  const itemCount = useAppSelector(itemCountSelector);
  const canLoad = useAppSelector(canLoadSelector);

  const scrollTargetRef = useRef<number | null>(null);

  const handleLoadMore = useCallback((): void => {
    if (!canLoad) return;
    scrollTargetRef.current = itemCount;
    onLoad();
  }, [canLoad, itemCount, onLoad]);

  useEffect(() => {
    if (scrollTargetRef.current === null) return;
    if (itemCount <= scrollTargetRef.current) return;

    const navId = buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, scrollTargetRef.current);
    scrollTargetRef.current = null;

    const frameId = requestAnimationFrame(() => {
      document.querySelector(`[data-nav-id="${navId}"]`)?.scrollIntoView({
        block: "start",
        behavior: "smooth"
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [itemCount, sectionIndex]);

  return handleLoadMore;
}
