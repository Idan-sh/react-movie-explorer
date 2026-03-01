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

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import { NAV_KEY, NAV_ZONE } from '../constants';
import type {
  NavState,
  NavConfig,
  UseKeyboardNavOptions,
  UseKeyboardNavReturn,
} from '../types';
import {
  isNavKey,
  resolveNavigation,
  resolveClickTarget,
  focusNavElement,
  getNavIdFromState,
} from '../utils';

const INITIAL_STATE: NavState = {
  activeZone: NAV_ZONE.TABS,
  tabIndex: 0,
  sectionIndex: 0,
  itemIndex: 0,
};

// ── Module-level callback type ────────────────────────────────────

interface NavCallbacks {
  onTabActivate: (tabIndex: number) => void;
  onItemActivate: (sectionIndex: number, itemIndex: number) => void;
  onEscape?: () => void;
  onFooterActivate?: (sectionIndex: number) => void;
}

// ── Module-level helpers ──────────────────────────────────────────

/**
 * Handles Enter key: triggers the appropriate activation callback
 * and optionally returns a new NavState (e.g., entering content zone from a category tab).
 */
function resolveEnterKey(
  state: NavState,
  config: NavConfig,
  callbacks: NavCallbacks,
): NavState | null {
  const { activeZone, tabIndex, sectionIndex, itemIndex } = state;

  if (activeZone === NAV_ZONE.TABS) {
    callbacks.onTabActivate(tabIndex);
    if (
      config.enterContentTabCount !== undefined &&
      tabIndex < config.enterContentTabCount
    ) {
      return {
        ...state,
        activeZone: NAV_ZONE.CONTENT,
        sectionIndex: 0,
        itemIndex: 0,
      };
    }
    return null;
  }

  const section = config.sections[sectionIndex];
  if (section?.hasFooter && itemIndex === section.itemCount) {
    callbacks.onFooterActivate?.(sectionIndex);
  } else {
    callbacks.onItemActivate(sectionIndex, itemIndex);
  }
  return null;
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
  initialItemIndex = 0,
  activeTabIndex,
  enabled = true,
  enterContentTabCount,
  initialScrollBehavior = 'smooth',
}: UseKeyboardNavOptions): UseKeyboardNavReturn {
  const [state, setState] = useState<NavState>({
    ...INITIAL_STATE,
    activeZone: initialZone,
    tabIndex: activeTabIndex ?? 0,
    itemIndex: initialItemIndex,
  });

  const stateRef = useRef(state);
  const configRef = useRef<NavConfig>({
    tabCount,
    sections,
    activeTabIndex,
    enterContentTabCount,
  });
  const callbacksRef = useRef<NavCallbacks>({
    onTabActivate,
    onItemActivate,
    onEscape,
    onFooterActivate,
  });

  useLayoutEffect(() => {
    stateRef.current = state;
    configRef.current = {
      tabCount,
      sections,
      activeTabIndex,
      enterContentTabCount,
    };
    callbacksRef.current = {
      onTabActivate,
      onItemActivate,
      onEscape,
      onFooterActivate,
    };
  });

  // Reset content focus when the view changes.
  const [prevContentKey, setPrevContentKey] = useState(contentKey);
  if (prevContentKey !== contentKey) {
    setPrevContentKey(contentKey);
    setState((prev) => ({ ...prev, sectionIndex: 0, itemIndex: 0 }));
  }

  // If in content zone but nothing to focus, snap back to tabs.
  if (
    state.activeZone === NAV_ZONE.CONTENT &&
    !sections.some((s) => s.itemCount > 0)
  ) {
    setState((prev) => ({ ...prev, activeZone: NAV_ZONE.TABS }));
  }

  // ── Global keydown listener (registered once) ────────────────
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent): void {
      const { key } = event;

      if (key === NAV_KEY.TAB) {
        event.preventDefault();
        return;
      }

      if (!isNavKey(key)) return;
      event.preventDefault();

      if (key === NAV_KEY.ENTER) {
        const newState = resolveEnterKey(
          stateRef.current,
          configRef.current,
          callbacksRef.current,
        );
        if (newState) setState(newState);
        return;
      }

      if (key === NAV_KEY.ESCAPE) {
        callbacksRef.current.onEscape?.();
      }

      setState(resolveNavigation(stateRef.current, key, configRef.current));
    }

    function handleClick(event: MouseEvent): void {
      const newState = resolveClickTarget(event);
      if (newState) setState(newState);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [enabled]);

  // ── DOM focus sync ───────────────────────────────────────────
  const isFirstFocus = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const behavior: ScrollBehavior = isFirstFocus.current
      ? initialScrollBehavior
      : 'smooth';

    const focused = focusNavElement(getNavIdFromState(state), { behavior });

    if (!focused) {
      (document.activeElement as HTMLElement)?.blur();
    }

    // Defer flag flip so both React strict-mode invocations use the same value
    const id = setTimeout(() => {
      isFirstFocus.current = false;
    }, 0);
    return () => clearTimeout(id);
  }, [enabled, state]); // eslint-disable-line react-hooks/exhaustive-deps

  const enterContent = useCallback((): void => {
    const firstSection = configRef.current.sections[0];
    if (firstSection && firstSection.itemCount > 0) {
      setState((prev) => ({
        ...prev,
        activeZone: NAV_ZONE.CONTENT,
        sectionIndex: 0,
        itemIndex: 0,
      }));
    }
  }, []);

  return {
    focusedTabIndex: state.activeZone === NAV_ZONE.TABS ? state.tabIndex : -1,
    focusedSectionIndex:
      state.activeZone === NAV_ZONE.CONTENT ? state.sectionIndex : -1,
    focusedItemIndex:
      state.activeZone === NAV_ZONE.CONTENT ? state.itemIndex : -1,
    enterContent,
  };
}
