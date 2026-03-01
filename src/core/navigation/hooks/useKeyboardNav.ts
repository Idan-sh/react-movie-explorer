/**
 * useKeyboardNav Hook
 *
 * Global keyboard navigation for the application.
 * Manages focus across two zones: tabs (header) and content (grids).
 *
 * DESIGN:
 * - All navigation logic lives in pure utils (resolveNavigation)
 * - This hook is thin: event listener + state management + DOM focus sync
 * - Uses refs for the event handler to avoid re-registering on every state change
 *
 * NAVIGATION FLOW:
 * - Tab key → always prevented (disabled per requirements)
 * - Arrow keys → delegated to resolveNavigation() for state transitions
 * - Enter → triggers activation callback (tab or item)
 * - Escape → triggers escape callback + resets to tabs zone
 *
 * DOM FOCUS SYNC:
 * After each state change, programmatically focuses the element
 * with the matching data-nav-id attribute. This triggers native
 * focus/blur events, connecting to existing handlers (e.g., 2s tab auto-switch).
 */

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { NAV_KEY, NAV_ZONE, NAV_SCROLL_STEP } from '../constants';
import type {
  NavState,
  ContentSection,
  UseKeyboardNavOptions,
  UseKeyboardNavReturn,
} from '../types';
import type { ScrollController } from '../utils';
import {
  isNavKey,
  resolveNavigation,
  resolveClickTarget,
  focusNavElement,
  createScrollController,
  getNavIdFromState,
} from '../utils';

const INITIAL_STATE: NavState = {
  activeZone: NAV_ZONE.TABS,
  tabIndex: 0,
  sectionIndex: 0,
  itemIndex: 0,
};

// ── Module-level callback type ────────────────────────────────────
// Matches the subset of UseKeyboardNavOptions callbacks used by activateEnterKey.
interface NavCallbacks {
  onTabActivate: (tabIndex: number) => void;
  onItemActivate: (sectionIndex: number, itemIndex: number) => void;
  onEscape: () => void;
  onFooterActivate?: (sectionIndex: number) => void;
}

// ── Module-level helpers ──────────────────────────────────────────
// Defined outside the hook so they are not recreated on every render.

/**
 * Handles Enter key: triggers the appropriate activation callback
 * based on the currently focused element (tab, grid item, or section footer).
 */
function activateEnterKey(
  state: NavState,
  sections: ContentSection[],
  callbacks: NavCallbacks,
): void {
  const { activeZone, tabIndex, sectionIndex, itemIndex } = state;
  if (activeZone === NAV_ZONE.TABS) {
    callbacks.onTabActivate(tabIndex);
    return;
  }
  const section = sections[sectionIndex];
  if (section?.hasFooter && itemIndex === section.itemCount) {
    callbacks.onFooterActivate?.(sectionIndex);
  } else {
    callbacks.onItemActivate(sectionIndex, itemIndex);
  }
}

/**
 * Handles Up/Down scroll in the CONTENT zone.
 * Returns true if the key was consumed (scroll happened),
 * false to fall through to normal grid navigation.
 *
 * Down: always scrolls.
 * Up: scrolls unless already at top, in which case falls through
 *     so normal nav can exit the content zone → tabs.
 */
function handleScrollKey(
  key: string,
  scrollEl: HTMLElement,
  controller: ScrollController,
  step: number,
): boolean {
  if (key === NAV_KEY.ARROW_DOWN) {
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    controller.scrollTo(
      scrollEl,
      Math.min(scrollEl.scrollTop + step, maxScroll),
    );
    return true;
  }
  if (key === NAV_KEY.ARROW_UP) {
    const newTarget = Math.max(scrollEl.scrollTop - step, 0);
    if (newTarget > 0 || scrollEl.scrollTop > 1) {
      controller.scrollTo(scrollEl, newTarget);
      return true;
    }
    // At top: snap to 0, cancel animation, fall through to normal nav
    scrollEl.scrollTop = 0;
    controller.cancel();
    return false;
  }
  return false;
}

// ── Hook ──────────────────────────────────────────────────────────

export function useKeyboardNav({
  tabCount,
  sections,
  contentKey,
  onTabActivate,
  onItemActivate,
  onEscape,
  onFooterActivate,
  initialZone = NAV_ZONE.TABS,
  activeTabIndex,
  enabled = true,
  scrollContainerRef,
}: UseKeyboardNavOptions): UseKeyboardNavReturn {
  const [state, setState] = useState<NavState>({
    ...INITIAL_STATE,
    activeZone: initialZone,
    tabIndex: activeTabIndex ?? 0,
  });

  // Refs keep the event handler stable (registered once) while
  // always reading the latest values via .current.
  // Updated via useLayoutEffect (not during render) per React 19 requirements.
  const stateRef = useRef(state);
  const configRef = useRef({
    tabCount,
    sections,
    activeTabIndex,
    scrollContainerRef,
  });
  const callbacksRef = useRef({
    onTabActivate,
    onItemActivate,
    onEscape,
    onFooterActivate,
  });
  const scrollController = useRef<ScrollController>(createScrollController());

  useLayoutEffect(() => {
    stateRef.current = state;
    configRef.current = {
      tabCount,
      sections,
      activeTabIndex,
      scrollContainerRef,
    };
    callbacksRef.current = {
      onTabActivate,
      onItemActivate,
      onEscape,
      onFooterActivate,
    };
  });

  // Reset content focus when the view changes.
  // "Store previous prop in state" pattern (react.dev/learn/you-might-not-need-an-effect):
  // calling setState during render when a prop changes causes React to discard the current
  // render and immediately re-render with the new state — no cascading commits.
  const [prevContentKey, setPrevContentKey] = useState(contentKey);
  if (prevContentKey !== contentKey) {
    setPrevContentKey(contentKey);
    setState((prev) => ({ ...prev, sectionIndex: 0, itemIndex: 0 }));
  }

  // ── Global keydown listener (registered once) ────────────────
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      // Tab key: always prevent, no action
      if (key === NAV_KEY.TAB) {
        event.preventDefault();
        return;
      }

      // Ignore non-navigation keys
      if (!isNavKey(key)) return;
      event.preventDefault();

      // Enter → trigger activation callback (no state change)
      if (key === NAV_KEY.ENTER) {
        activateEnterKey(
          stateRef.current,
          configRef.current.sections,
          callbacksRef.current,
        );
        return;
      }

      // Scroll mode: in CONTENT zone, Up/Down lerp-scroll the container.
      const scrollEl = configRef.current.scrollContainerRef?.current;
      if (scrollEl && stateRef.current.activeZone === NAV_ZONE.CONTENT) {
        const consumed = handleScrollKey(
          key,
          scrollEl,
          scrollController.current,
          NAV_SCROLL_STEP,
        );
        if (consumed) return;
      }

      // Escape → trigger callback before state reset
      if (key === NAV_KEY.ESCAPE) {
        callbacksRef.current.onEscape();
      }

      // Arrow keys + Escape → pure state transition
      setState(resolveNavigation(stateRef.current, key, configRef.current));
    }

    // Sync nav state when user clicks a navigable element
    function handleClick(event: MouseEvent): void {
      const newState = resolveClickTarget(event);
      if (newState) setState(newState);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
      scrollController.current.cancel();
    };
  }, [enabled]);

  // ── DOM focus sync ───────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const focused = focusNavElement(getNavIdFromState(state));

    // If focus couldn't move (e.g. target is display:none on mobile),
    // explicitly blur the stale element so it doesn't retain a visible ring
    // or intercept keyboard events.
    if (!focused) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [enabled, state]);

  return {
    focusedTabIndex: state.activeZone === NAV_ZONE.TABS ? state.tabIndex : -1,
    focusedSectionIndex:
      state.activeZone === NAV_ZONE.CONTENT ? state.sectionIndex : -1,
    focusedItemIndex:
      state.activeZone === NAV_ZONE.CONTENT ? state.itemIndex : -1,
  };
}
