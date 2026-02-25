/**
 * Navigation Utilities
 *
 * Pure functions for calculating navigation indices
 * and managing DOM focus via data-nav-id attributes.
 */

import { NAV_KEY, NAV_ZONE } from "../constants";
import type { ContentSection, NavState, NavConfig } from "../types";

/**
 * Set of all navigation key values for fast lookup.
 */
const NAV_KEY_VALUES: ReadonlySet<string> = new Set(Object.values(NAV_KEY));

/**
 * Checks whether a keyboard key is one of our navigation keys.
 */
export function isNavKey(key: string): boolean {
  return NAV_KEY_VALUES.has(key);
}

/**
 * Calculates the next tab index for horizontal navigation.
 * Wraps around at both ends (left from first → last, right from last → first).
 */
export function getNextTabIndex(current: number, key: string, total: number): number {
  if (key === NAV_KEY.ARROW_RIGHT) return (current + 1) % total;
  if (key === NAV_KEY.ARROW_LEFT) return (current - 1 + total) % total;
  return current;
}

/**
 * Calculates the next item index within a grid section.
 *
 * Movement rules:
 * - Left/Right: move within the same row, stop at row boundaries
 * - Up: move to same column in previous row
 * - Down: move to same column in next row
 *
 * Returns sentinel values for zone transitions:
 * - -1: navigation should exit the section UPWARD
 * - Infinity: navigation should exit the section DOWNWARD
 */
export function getNextGridIndex(current: number, key: string, section: ContentSection): number {
  const { itemCount, columns } = section;
  const row = Math.floor(current / columns);
  const col = current % columns;

  switch (key) {
    case NAV_KEY.ARROW_RIGHT: {
      if (col >= columns - 1) return current;
      const next = current + 1;
      return next < itemCount ? next : current;
    }
    case NAV_KEY.ARROW_LEFT: {
      if (col <= 0) return current;
      return current - 1;
    }
    case NAV_KEY.ARROW_DOWN: {
      const next = current + columns;
      return next < itemCount ? next : Infinity;
    }
    case NAV_KEY.ARROW_UP: {
      if (row === 0) return -1;
      return current - columns;
    }
    default:
      return current;
  }
}

/**
 * Builds a data-nav-id value from a prefix and index parts.
 *
 * @example buildNavId('nav-tab', 2) → 'nav-tab-2'
 * @example buildNavId('nav-item', 0, 3) → 'nav-item-0-3'
 */
export function buildNavId(prefix: string, ...indices: number[]): string {
  return `${prefix}-${indices.join("-")}`;
}

/**
 * Moves DOM focus to the element matching a data-nav-id.
 * Uses scrollIntoView to keep the focused element visible.
 */
export function focusNavElement(navId: string): void {
  const element = document.querySelector(`[data-nav-id="${navId}"]`);
  if (element instanceof HTMLElement) {
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

// ── Section transition helpers ─────────────────────────────────

/**
 * When entering a section from above (moving DOWN into it),
 * land on the same column in the first row.
 * Clamps to last item if the section is shorter than the column.
 */
export function getFirstRowTargetIndex(currentCol: number, targetSection: ContentSection): number {
  return Math.min(currentCol, targetSection.itemCount - 1);
}

/**
 * When entering a section from below (moving UP into it),
 * land on the same column in the last row.
 * Clamps to last item if the last row is shorter than the column.
 */
export function getLastRowTargetIndex(currentCol: number, targetSection: ContentSection): number {
  const { itemCount, columns } = targetSection;
  const lastRowStart = Math.floor((itemCount - 1) / columns) * columns;
  return Math.min(lastRowStart + currentCol, itemCount - 1);
}

// ── High-level navigation resolvers ────────────────────────────

/**
 * Resolves tabs-zone navigation.
 * Left/Right wraps between tabs. Down enters content zone.
 */
function resolveTabsNavigation(state: NavState, key: string, config: NavConfig): NavState {
  if (key === NAV_KEY.ARROW_LEFT || key === NAV_KEY.ARROW_RIGHT) {
    return { ...state, tabIndex: getNextTabIndex(state.tabIndex, key, config.tabCount) };
  }

  if (key === NAV_KEY.ARROW_DOWN) {
    const firstSection = config.sections[0];
    if (firstSection && firstSection.itemCount > 0) {
      return { ...state, activeZone: NAV_ZONE.CONTENT, sectionIndex: 0, itemIndex: 0 };
    }
  }

  // Arrow Up in tabs → no-op
  return state;
}

/**
 * Resolves content-zone navigation.
 * Moves within the grid, transitions between sections,
 * or exits to tabs zone when navigating above the first section.
 */
function resolveContentNavigation(state: NavState, key: string, config: NavConfig): NavState {
  const section = config.sections[state.sectionIndex];
  if (!section) return state;

  const nextIndex = getNextGridIndex(state.itemIndex, key, section);
  const col = state.itemIndex % section.columns;

  // Normal move within section
  if (nextIndex >= 0 && nextIndex !== Infinity) {
    return { ...state, itemIndex: nextIndex };
  }

  // Exit upward (-1 sentinel)
  if (nextIndex === -1) {
    if (state.sectionIndex > 0) {
      const prevSection = config.sections[state.sectionIndex - 1];
      return {
        ...state,
        sectionIndex: state.sectionIndex - 1,
        itemIndex: getLastRowTargetIndex(col, prevSection)
      };
    }
    return { ...state, activeZone: NAV_ZONE.TABS };
  }

  // Exit downward (Infinity sentinel)
  if (state.sectionIndex < config.sections.length - 1) {
    const nextSection = config.sections[state.sectionIndex + 1];
    return {
      ...state,
      sectionIndex: state.sectionIndex + 1,
      itemIndex: getFirstRowTargetIndex(col, nextSection)
    };
  }

  // At bottom of last section → no-op
  return state;
}

/**
 * Pure state transition for keyboard navigation.
 * Given current state + key press, returns the new state.
 *
 * Handles: Escape (reset to tabs), arrow keys in both zones.
 * Does NOT handle: Enter (side effect), Tab (preventDefault only).
 */
export function resolveNavigation(state: NavState, key: string, config: NavConfig): NavState {
  if (key === NAV_KEY.ESCAPE) {
    return { activeZone: NAV_ZONE.TABS, tabIndex: 0, sectionIndex: 0, itemIndex: 0 };
  }

  if (state.activeZone === NAV_ZONE.TABS) {
    return resolveTabsNavigation(state, key, config);
  }

  return resolveContentNavigation(state, key, config);
}
