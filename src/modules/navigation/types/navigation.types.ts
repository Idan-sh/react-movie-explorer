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
  /** Called when Escape is pressed */
  onEscape: () => void;
  /** Whether keyboard navigation is enabled (default: true) */
  enabled?: boolean;
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
}
