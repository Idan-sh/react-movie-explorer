/**
 * usePageNavigation Hook
 *
 * Generic keyboard navigation for any page with tabs + grid sections.
 * Receives item arrays and callbacks — knows nothing about specific data types.
 *
 * Convenience layer over useKeyboardNav:
 * - Derives section definitions from item arrays
 * - Maps item activation (sectionIdx, itemIdx) → direct item callback
 */

import { useMemo, useCallback } from 'react';
import type { ContentSection, NavZone, UseKeyboardNavReturn } from '../types';
import { useKeyboardNav } from './useKeyboardNav';

export interface UsePageNavigationOptions<T> {
  /** Number of tabs in the tab bar */
  tabCount: number;
  /** Items per content section (array of arrays) */
  sectionItems: T[][];
  /** Number of grid columns per section */
  columns: number;
  /** Changes to this value reset content focus */
  contentKey: string;
  /** Called when a tab is activated via Enter (receives tab index) */
  onTabActivate: (tabIndex: number) => void;
  /** Called when a content item is activated via Enter (receives the item) */
  onItemActivate: (item: T) => void;
  /** Called when Escape is pressed (no-op if omitted) */
  onEscape?: () => void;
  /** Whether each section has a footer element (e.g., Load More button) */
  sectionHasFooter?: boolean[];
  /** Called when Enter is pressed on a section footer */
  onFooterActivate?: (sectionIndex: number) => void;
  /** Which zone to start in on mount (default: tabs) */
  initialZone?: NavZone;
  /** Initial content item index when starting in content zone */
  initialItemIndex?: number;
  /** Scroll behavior for the initial focus on mount (default: 'smooth') */
  initialScrollBehavior?: ScrollBehavior;
  /** Index of the currently active (displayed) tab — also used as initial focus on mount */
  activeTabIndex?: number;
  /** Disable all keyboard handling (e.g. when a modal is open) */
  enabled?: boolean;
  /** Tabs below this index also enter content zone on Enter (category tabs) */
  enterContentTabCount?: number;
  /** Per-section column overrides (falls back to `columns` if not provided) */
  sectionColumns?: number[];
  /** Optional 2D row layout for tabs — see UseKeyboardNavOptions.tabRows */
  tabRows?: number[][];
}

/**
 * Generic page-level keyboard navigation.
 * Wraps useKeyboardNav with section derivation and item lookup.
 */
export function usePageNavigation<T>({
  tabCount,
  sectionItems,
  columns,
  contentKey,
  onTabActivate,
  onItemActivate,
  onEscape,
  sectionHasFooter,
  onFooterActivate,
  initialZone,
  initialItemIndex,
  initialScrollBehavior,
  activeTabIndex,
  enabled = true,
  enterContentTabCount,
  sectionColumns,
  tabRows,
}: UsePageNavigationOptions<T>): UseKeyboardNavReturn {
  // Derive section definitions from item arrays
  const sections = useMemo(
    (): ContentSection[] =>
      sectionItems.map((items, i) => ({
        itemCount: items.length,
        columns: sectionColumns?.[i] ?? columns,
        hasFooter: sectionHasFooter?.[i] ?? false,
      })),
    [sectionItems, columns, sectionColumns, sectionHasFooter],
  );

  // Look up the item by section and index, then delegate to caller
  const handleItemActivate = useCallback(
    (sectionIdx: number, itemIdx: number): void => {
      const item = sectionItems[sectionIdx]?.[itemIdx];
      if (item !== undefined) onItemActivate(item);
    },
    [sectionItems, onItemActivate],
  );

  return useKeyboardNav({
    tabCount,
    sections,
    contentKey,
    onTabActivate,
    onItemActivate: handleItemActivate,
    onEscape,
    onFooterActivate,
    initialZone,
    initialItemIndex,
    initialScrollBehavior,
    activeTabIndex,
    enabled,
    enterContentTabCount,
    tabRows,
  });
}
