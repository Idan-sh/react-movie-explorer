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

import { useState, useEffect, useRef } from 'react';
import { NAV_KEY, NAV_ZONE, NAV_ID_PREFIX } from '../constants';
import type { NavState, UseKeyboardNavOptions, UseKeyboardNavReturn } from '../types';
import { isNavKey, resolveNavigation, resolveClickTarget, buildNavId, focusNavElement } from '../utils';

const INITIAL_STATE: NavState = {
  activeZone: NAV_ZONE.TABS,
  tabIndex: 0,
  sectionIndex: 0,
  itemIndex: 0,
};

export function useKeyboardNav({
  tabCount,
  sections,
  contentKey,
  onTabActivate,
  onItemActivate,
  onEscape,
  onFooterActivate,
  enabled = true,
}: UseKeyboardNavOptions): UseKeyboardNavReturn {
  const [state, setState] = useState<NavState>(INITIAL_STATE);

  // Refs keep the event handler stable (registered once) while
  // always reading the latest values via .current
  const stateRef = useRef(state);
  stateRef.current = state;

  const configRef = useRef({ tabCount, sections });
  configRef.current = { tabCount, sections };

  const callbacksRef = useRef({ onTabActivate, onItemActivate, onEscape, onFooterActivate });
  callbacksRef.current = { onTabActivate, onItemActivate, onEscape, onFooterActivate };

  // Reset content focus when the view changes
  useEffect(() => {
    setState(prev => ({ ...prev, sectionIndex: 0, itemIndex: 0 }));
  }, [contentKey]);

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
        const { activeZone, tabIndex, sectionIndex, itemIndex } = stateRef.current;
        if (activeZone === NAV_ZONE.TABS) {
          callbacksRef.current.onTabActivate(tabIndex);
        } else {
          const section = configRef.current.sections[sectionIndex];
          if (section?.hasFooter && itemIndex === section.itemCount) {
            callbacksRef.current.onFooterActivate?.(sectionIndex);
          } else {
            callbacksRef.current.onItemActivate(sectionIndex, itemIndex);
          }
        }
        return;
      }

      // Escape → trigger callback before state reset
      if (key === NAV_KEY.ESCAPE) {
        callbacksRef.current.onEscape();
      }

      // Arrow keys + Escape → pure state transition
      const newState = resolveNavigation(stateRef.current, key, configRef.current);
      setState(newState);
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
    };
  }, [enabled]);

  // ── DOM focus sync ───────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    if (state.activeZone === NAV_ZONE.TABS) {
      focusNavElement(buildNavId(NAV_ID_PREFIX.TAB, state.tabIndex));
    } else {
      focusNavElement(buildNavId(NAV_ID_PREFIX.ITEM, state.sectionIndex, state.itemIndex));
    }
  }, [enabled, state]);

  return {
    focusedTabIndex: state.activeZone === NAV_ZONE.TABS ? state.tabIndex : -1,
    focusedSectionIndex: state.activeZone === NAV_ZONE.CONTENT ? state.sectionIndex : -1,
    focusedItemIndex: state.activeZone === NAV_ZONE.CONTENT ? state.itemIndex : -1,
  };
}
