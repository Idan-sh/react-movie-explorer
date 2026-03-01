/**
 * useHamburgerMenu Hook
 *
 * Manages mobile hamburger menu open/close state and keyboard navigation.
 * Only active on mobile viewports (below md breakpoint) via useIsMobile.
 *
 * KEYBOARD BEHAVIOR (mobile, menu closed, TABS zone active):
 * - Enter: open the menu, pre-focused on the current tab index
 *
 * KEYBOARD BEHAVIOR (mobile, menu open):
 * - ArrowUp/Left: focus previous item (wraps)
 * - ArrowDown/Right: focus next item (wraps)
 * - Enter: select focused item and close menu
 * - Escape: close menu without selecting
 *
 * Both handlers run in capture phase to intercept before the global keyboard
 * nav, using stopImmediatePropagation so the global nav never sees the key.
 *
 * On desktop, none of these handlers are registered — keyboard events
 * fall through to the global nav which handles tab activation directly.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { AppView } from '@/shared/types';
import { APP_VIEW_TABS } from '@/shared/constants';
import { buildNavId, focusNavElement, NAV_ID_PREFIX } from '@/core/navigation';
import { useIsMobile } from './useIsMobile';

const TAB_COUNT = APP_VIEW_TABS.length;

export interface UseHamburgerMenuReturn {
  isMenuOpen: boolean;
  focusedMenuIndex: number;
  toggleMenu: () => void;
  handleMobileTabClick: (view: AppView) => void;
}

export function useHamburgerMenu(
  onTabClick: (view: AppView) => void,
  focusedTabIndex: number,
): UseHamburgerMenuReturn {
  const isMobile = useIsMobile();
  const [isMenuOpenRaw, setIsMenuOpenRaw] = useState(false);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(0);

  // Menu can only be open on mobile — derived value, no effect needed
  const isMenuOpen = isMenuOpenRaw && isMobile;

  const focusedMenuIndexRef = useRef(focusedMenuIndex);
  useEffect(() => {
    focusedMenuIndexRef.current = focusedMenuIndex;
  }, [focusedMenuIndex]);

  const focusedTabIndexRef = useRef(focusedTabIndex);
  useEffect(() => {
    focusedTabIndexRef.current = focusedTabIndex;
  }, [focusedTabIndex]);

  // Opens menu and pre-focuses the item matching the current global tab index
  const toggleMenu = useCallback((): void => {
    setIsMenuOpenRaw((prev) => {
      if (!prev) {
        setFocusedMenuIndex(Math.max(0, focusedTabIndexRef.current));
      }
      return !prev;
    });
  }, []);

  const handleMobileTabClick = useCallback(
    (view: AppView): void => {
      setIsMenuOpenRaw(false);
      onTabClick(view);
    },
    [onTabClick],
  );

  const handleMobileTabClickRef = useRef(handleMobileTabClick);
  useEffect(() => {
    handleMobileTabClickRef.current = handleMobileTabClick;
  }, [handleMobileTabClick]);

  // Sync DOM focus to the focused menu button while menu is open
  useEffect(() => {
    if (!isMenuOpen) return;
    focusNavElement(buildNavId(NAV_ID_PREFIX.TAB, focusedMenuIndex));
  }, [isMenuOpen, focusedMenuIndex]);

  // ── Capture Enter when menu is CLOSED + TABS zone is active (mobile only) ──
  // Opens the menu; stopImmediatePropagation prevents global nav from also
  // firing onTabActivate for the same Enter press.
  // On desktop, this effect is skipped — Enter falls through to global nav.
  useEffect(() => {
    if (!isMobile || isMenuOpen || focusedTabIndex === -1) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setFocusedMenuIndex(Math.max(0, focusedTabIndexRef.current));
      setIsMenuOpenRaw(true);
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isMobile, isMenuOpen, focusedTabIndex]);

  // ── Navigate within menu when it is OPEN (mobile only) ─────────────────────
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(e: KeyboardEvent): void {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          e.stopImmediatePropagation();
          setFocusedMenuIndex((prev) => (prev - 1 + TAB_COUNT) % TAB_COUNT);
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          e.stopImmediatePropagation();
          setFocusedMenuIndex((prev) => (prev + 1) % TAB_COUNT);
          break;
        case 'Enter':
          e.preventDefault();
          e.stopImmediatePropagation();
          handleMobileTabClickRef.current(
            APP_VIEW_TABS[focusedMenuIndexRef.current],
          );
          break;
        case 'Escape':
          e.preventDefault();
          e.stopImmediatePropagation();
          setIsMenuOpenRaw(false);
          break;
        case 'Tab':
          e.preventDefault();
          e.stopImmediatePropagation();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isMenuOpen]);

  return { isMenuOpen, focusedMenuIndex, toggleMenu, handleMobileTabClick };
}
