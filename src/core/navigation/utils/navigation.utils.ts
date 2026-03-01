/**
 * Stateless calculations for navigation indices and state transitions.
 * DOM-touching helpers live in dom.utils.ts.
 */

import { NAV_KEY, NAV_ZONE, NAV_ID_PREFIX } from '../constants';
import type { ContentSection, NavState, NavConfig } from '../types';

const NAV_KEY_VALUES: ReadonlySet<string> = new Set(Object.values(NAV_KEY));

export function isNavKey(key: string): boolean {
  return NAV_KEY_VALUES.has(key);
}

export function getNextTabIndex(
  current: number,
  key: string,
  total: number,
): number {
  if (key === NAV_KEY.ARROW_RIGHT) return (current + 1) % total;
  if (key === NAV_KEY.ARROW_LEFT) return (current - 1 + total) % total;
  return current;
}

/**
 * Returns sentinel values for zone transitions: -1 (exit upward), Infinity (exit downward).
 */
export function getNextGridIndex(
  current: number,
  key: string,
  section: ContentSection,
): number {
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

export function buildNavId(prefix: string, ...indices: number[]): string {
  return `${prefix}-${indices.join('-')}`;
}

// ── Section transition helpers ─────────────────────────────────

export function getFirstRowTargetIndex(
  currentCol: number,
  targetSection: ContentSection,
): number {
  return Math.min(currentCol, targetSection.itemCount - 1);
}

export function getLastRowTargetIndex(
  currentCol: number,
  targetSection: ContentSection,
): number {
  const { itemCount, columns } = targetSection;
  const lastRowStart = Math.floor((itemCount - 1) / columns) * columns;
  return Math.min(lastRowStart + currentCol, itemCount - 1);
}

// ── Footer navigation ───────────────────────────────────────────

function resolveFooterNavigation(
  state: NavState,
  key: string,
  config: NavConfig,
): NavState {
  const section = config.sections[state.sectionIndex];

  if (key === NAV_KEY.ARROW_UP) {
    if (section.itemCount === 0) return state;
    return { ...state, itemIndex: section.itemCount - 1 };
  }

  if (
    key === NAV_KEY.ARROW_DOWN &&
    state.sectionIndex < config.sections.length - 1
  ) {
    const nextSection = config.sections[state.sectionIndex + 1];
    return {
      ...state,
      sectionIndex: state.sectionIndex + 1,
      itemIndex: getFirstRowTargetIndex(0, nextSection),
    };
  }

  return state;
}

// ── Scroll controller ───────────────────────────────────────────

export interface ScrollController {
  scrollTo(el: HTMLElement, target: number): void;
  cancel(): void;
}

/** 12% of remaining delta per frame at 60fps ≈ natural ease-out curve. */
export function createScrollController(): ScrollController {
  let target = 0;
  let rafId: number | null = null;

  function step(el: HTMLElement): void {
    const delta = target - el.scrollTop;
    if (Math.abs(delta) < 0.5) {
      el.scrollTop = target;
      rafId = null;
      return;
    }
    el.scrollTop = el.scrollTop + delta * 0.12;
    rafId = requestAnimationFrame(() => step(el));
  }

  return {
    scrollTo(el: HTMLElement, newTarget: number): void {
      target = newTarget;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => step(el));
    },
    cancel(): void {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}

// ── Nav ID from state ────────────────────────────────────────────

export function getNavIdFromState(state: NavState): string {
  return state.activeZone === NAV_ZONE.TABS
    ? buildNavId(NAV_ID_PREFIX.TAB, state.tabIndex)
    : buildNavId(NAV_ID_PREFIX.ITEM, state.sectionIndex, state.itemIndex);
}

// ── High-level navigation resolvers ────────────────────────────

function resolveTabsNavigation(
  state: NavState,
  key: string,
  config: NavConfig,
): NavState {
  if (key === NAV_KEY.ARROW_LEFT || key === NAV_KEY.ARROW_RIGHT) {
    return {
      ...state,
      tabIndex: getNextTabIndex(state.tabIndex, key, config.tabCount),
    };
  }

  if (key === NAV_KEY.ARROW_DOWN) {
    const firstSection = config.sections[0];
    if (firstSection && firstSection.itemCount > 0) {
      return {
        ...state,
        activeZone: NAV_ZONE.CONTENT,
        sectionIndex: 0,
        itemIndex: 0,
      };
    }
  }

  // Arrow Up in tabs → no-op
  return state;
}

function resolveContentNavigation(
  state: NavState,
  key: string,
  config: NavConfig,
): NavState {
  const section = config.sections[state.sectionIndex];
  if (!section) return state;

  // Delegate to footer helper when focused on a section footer
  if (state.itemIndex === section.itemCount && section.hasFooter) {
    return resolveFooterNavigation(state, key, config);
  }

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
      // Land on previous section's footer if it has one
      if (prevSection.hasFooter) {
        return {
          ...state,
          sectionIndex: state.sectionIndex - 1,
          itemIndex: prevSection.itemCount,
        };
      }
      return {
        ...state,
        sectionIndex: state.sectionIndex - 1,
        itemIndex: getLastRowTargetIndex(col, prevSection),
      };
    }
    return { ...state, activeZone: NAV_ZONE.TABS };
  }

  // Exit downward (Infinity sentinel) → footer if available, else next section
  if (section.hasFooter) {
    return { ...state, itemIndex: section.itemCount };
  }

  if (state.sectionIndex < config.sections.length - 1) {
    const nextSection = config.sections[state.sectionIndex + 1];
    return {
      ...state,
      sectionIndex: state.sectionIndex + 1,
      itemIndex: getFirstRowTargetIndex(col, nextSection),
    };
  }

  // At bottom of last section with no footer → no-op
  return state;
}

export function resolveNavigation(
  state: NavState,
  key: string,
  config: NavConfig,
): NavState {
  if (key === NAV_KEY.ESCAPE) {
    const tabIndex = config.activeTabIndex ?? state.tabIndex;
    return {
      ...state,
      activeZone: NAV_ZONE.TABS,
      tabIndex,
      sectionIndex: 0,
      itemIndex: 0,
    };
  }

  if (state.activeZone === NAV_ZONE.TABS) {
    return resolveTabsNavigation(state, key, config);
  }

  return resolveContentNavigation(state, key, config);
}
