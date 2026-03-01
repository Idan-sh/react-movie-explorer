import { NAV_ZONE, NAV_ID_PREFIX } from '../constants';
import type { NavState } from '../types';

/**
 * Moves DOM focus to the element matching a data-nav-id.
 * Returns true if the element was found and received focus.
 */
export function focusNavElement(navId: string): boolean {
  const element = document.querySelector(`[data-nav-id="${navId}"]`);
  if (element instanceof HTMLElement) {
    element.focus({ preventScroll: true });
    if (document.activeElement === element) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return true;
    }
  }
  return false;
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
