import { NAV_ZONE, NAV_ID_PREFIX } from '../constants';
import type { NavState } from '../types';
import {
  getNavIdFromState,
  getNextTabIndex,
  buildNavId,
} from './navigation.utils';

/**
 * Moves DOM focus to the first *visible* element matching a data-nav-id.
 * Skips elements inside display:none containers (offsetParent === null).
 * Returns true if a visible element was found and received focus.
 */
export interface FocusNavOptions {
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
}

export function focusNavElement(
  navId: string,
  {
    block = 'center',
    inline = 'center',
    behavior = 'smooth',
  }: FocusNavOptions = {},
): boolean {
  const elements = document.querySelectorAll(`[data-nav-id="${navId}"]`);
  for (const element of elements) {
    if (!(element instanceof HTMLElement) || element.offsetParent === null)
      continue;
    element.focus({ preventScroll: true });
    if (document.activeElement === element) {
      element.scrollIntoView({ block, inline, behavior });
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a visible, focusable element exists for the given nav-id.
 * Used by keyboard navigation to skip hidden tabs without focusing them.
 */
export function canFocusNavElement(navId: string): boolean {
  const elements = document.querySelectorAll(`[data-nav-id="${navId}"]`);
  for (const element of elements) {
    if (element instanceof HTMLElement && element.offsetParent !== null)
      return true;
  }
  return false;
}

/**
 * Advances tab index past hidden (unfocusable) elements in the given
 * arrow-key direction. Returns the state unchanged if already focusable.
 */
export function skipToFocusableTab(
  state: NavState,
  key: string,
  tabCount: number,
): NavState {
  for (let i = 0; i < tabCount - 1; i++) {
    if (canFocusNavElement(getNavIdFromState(state))) break;
    state = {
      ...state,
      tabIndex: getNextTabIndex(state.tabIndex, key, tabCount),
    };
  }
  return state;
}

/**
 * Searches forward from `startIndex` for the first tab that can receive
 * DOM focus. Focuses it and returns its index, or null if none found.
 */
export function focusNextAvailableTab(
  startIndex: number,
  tabCount: number,
  options?: FocusNavOptions,
): number | null {
  for (let i = 1; i < tabCount; i++) {
    const nextIndex = (startIndex + i) % tabCount;
    const navId = buildNavId(NAV_ID_PREFIX.TAB, nextIndex);
    if (focusNavElement(navId, options)) return nextIndex;
  }
  return null;
}

/**
 * Resolves NavState from a clicked element's data-nav-id.
 * Returns null if the click target has no nav ID.
 *
 * Uses closest() to walk up the DOM — handles clicks on child
 * elements (e.g., clicking a poster image inside a MovieCard).
 */
export function resolveClickTarget(event: MouseEvent): NavState | null {
  const target = (event.target as HTMLElement)?.closest('[data-nav-id]');
  if (!target) return null;

  const navId = target.getAttribute('data-nav-id');
  if (!navId) return null;

  if (navId.startsWith(NAV_ID_PREFIX.TAB + '-')) {
    const tabIndex = parseInt(navId.slice(NAV_ID_PREFIX.TAB.length + 1), 10);
    if (!isNaN(tabIndex)) {
      return {
        activeZone: NAV_ZONE.TABS,
        tabIndex,
        sectionIndex: 0,
        itemIndex: 0,
      };
    }
  }

  if (navId.startsWith(NAV_ID_PREFIX.ITEM + '-')) {
    const parts = navId
      .slice(NAV_ID_PREFIX.ITEM.length + 1)
      .split('-')
      .map(Number);
    if (parts.length === 2 && parts.every((n) => !isNaN(n))) {
      return {
        activeZone: NAV_ZONE.CONTENT,
        tabIndex: 0,
        sectionIndex: parts[0],
        itemIndex: parts[1],
      };
    }
  }

  return null;
}
