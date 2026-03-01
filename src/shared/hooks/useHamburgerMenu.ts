/**
 * useHamburgerMenu Hook
 *
 * Manages mobile hamburger menu open/close state and keyboard navigation.
 * Only active on mobile viewports (below lg breakpoint) via useIsMobile.
 *
 * KEYBOARD BEHAVIOR (mobile, menu closed, hamburger tab focused):
 * - Enter: open the menu, pre-focused on the first item
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
  hamburgerTabIndex?: number,
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

  const toggleMenu = useCallback((): void => {
    setIsMenuOpenRaw((prev) => {
      if (!prev) setFocusedMenuIndex(0);
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

  // ── Capture Enter when hamburger is focused + menu is CLOSED (mobile only) ──
  // Opens the menu; stopImmediatePropagation prevents global nav from also
  // firing onTabActivate for the same Enter press.
  // Only intercepts when the hamburger's own tab index is focused — other header
  // elements (search, theme, settings) let Enter through to the global nav.
  const isHamburgerFocused =
    isMobile &&
    !isMenuOpen &&
    hamburgerTabIndex !== undefined &&
    focusedTabIndex === hamburgerTabIndex;

  useEffect(() => {
    if (!isHamburgerFocused) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setFocusedMenuIndex(0);
      setIsMenuOpenRaw(true);
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isHamburgerFocused]);

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
