/**
 * Navigation Types
 *
 * Types for the keyboard navigation system.
 */

import type { NAV_ZONE } from '../constants';

/**
 * Navigation zone identifier
 */
export type NavZone = (typeof NAV_ZONE)[keyof typeof NAV_ZONE];

/**
 * Describes a navigable content section (e.g., a movie grid).
 * Multiple sections can exist in home view (popular + now playing).
 */
export interface ContentSection {
  itemCount: number;
  columns: number;
  /** Whether a footer element (e.g., Load More button) exists below the grid */
  hasFooter?: boolean;
}

/**
 * Options for the useKeyboardNav hook
 */
export interface UseKeyboardNavOptions {
  /** Number of tabs in the tab bar */
  tabCount: number;
  /** Content sections to navigate (grids) */
  sections: ContentSection[];
  /** Changes to this value reset content focus (e.g., activeView) */
  contentKey: string;
  /** Called when Enter is pressed on a tab */
  onTabActivate: (tabIndex: number) => void;
  /** Called when Enter is pressed on a content item */
  onItemActivate: (sectionIndex: number, itemIndex: number) => void;
  /** Called when Escape is pressed (no-op if omitted) */
  onEscape?: () => void;
  /** Called when Enter is pressed on a section footer (e.g., Load More button) */
  onFooterActivate?: (sectionIndex: number) => void;
  /** Which zone to start in on mount (default: tabs) */
  initialZone?: NavZone;
  /** Index of the currently active (displayed) tab — also used as initial focus on mount */
  activeTabIndex?: number;
  /** Whether keyboard navigation is enabled (default: true) */
  enabled?: boolean;
  /**
   * When provided, Up/Down in the CONTENT zone scroll this element instead of
   * navigating the grid. Up falls through to normal nav once scrollTop reaches 0,
   * allowing the user to exit back to the tabs zone naturally.
   */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Return value from useKeyboardNav hook.
 * All indices are -1 when the zone is not active.
 */
export interface UseKeyboardNavReturn {
  /** Focused tab index, or -1 if not in tabs zone */
  focusedTabIndex: number;
  /** Focused content section index, or -1 if not in content zone */
  focusedSectionIndex: number;
  /** Focused item index within the section, or -1 if not in content zone */
  focusedItemIndex: number;
}

/**
 * Internal navigation state tracked by the hook.
 * Passed to resolveNavigation() for pure state transitions.
 */
export interface NavState {
  activeZone: NavZone;
  tabIndex: number;
  sectionIndex: number;
  itemIndex: number;
}

/**
 * Configuration for navigation calculations.
 * Describes the layout that resolveNavigation() operates on.
 */
export interface NavConfig {
  tabCount: number;
  sections: ContentSection[];
  /** Index of the currently active (displayed) tab — used by Escape to snap back to it */
  activeTabIndex?: number;
}
