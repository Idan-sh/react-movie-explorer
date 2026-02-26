/**
 * useHamburgerMenu Hook
 *
 * Manages mobile hamburger menu open/close state and keyboard navigation.
 *
 * KEYBOARD BEHAVIOR (menu closed, TABS zone active):
 * - Enter: open the menu, pre-focused on the current tab index
 *
 * KEYBOARD BEHAVIOR (menu open):
 * - ArrowUp/Left: focus previous item (wraps)
 * - ArrowDown/Right: focus next item (wraps)
 * - Enter: select focused item and close menu
 * - Escape: close menu without selecting
 *
 * Both handlers run in capture phase to intercept before the global keyboard
 * nav, using stopImmediatePropagation so the global nav never sees the key.
 *
 * Closes the menu when the viewport resizes to desktop width.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { AppView } from '@/shared/types';
import { APP_VIEW_TABS } from '@/shared/constants';
import { buildNavId, focusNavElement, NAV_ID_PREFIX } from '@/modules/navigation';

const MD_BREAKPOINT_PX = 768;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(0);

  // Refs so handlers always read the latest values without re-registering
  const focusedMenuIndexRef = useRef(focusedMenuIndex);
  useEffect(() => { focusedMenuIndexRef.current = focusedMenuIndex; }, [focusedMenuIndex]);

  const focusedTabIndexRef = useRef(focusedTabIndex);
  useEffect(() => { focusedTabIndexRef.current = focusedTabIndex; }, [focusedTabIndex]);

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMobileTabClick = useCallback(
    (view: AppView): void => {
      setIsMenuOpen(false);
      onTabClick(view);
    },
    [onTabClick]
  );

  const handleMobileTabClickRef = useRef(handleMobileTabClick);
  useEffect(() => { handleMobileTabClickRef.current = handleMobileTabClick; }, [handleMobileTabClick]);

  // When menu opens, pre-focus the item matching the current global tab index
  // (so keyboard-opened menu lands on the right item automatically)
  useEffect(() => {
    if (isMenuOpen) {
      setFocusedMenuIndex(Math.max(0, focusedTabIndexRef.current));
    }
  }, [isMenuOpen]);

  // Sync DOM focus to the focused menu button while menu is open
  useEffect(() => {
    if (!isMenuOpen) return;
    focusNavElement(buildNavId(NAV_ID_PREFIX.TAB, focusedMenuIndex));
  }, [isMenuOpen, focusedMenuIndex]);

  // ── Capture Enter when menu is CLOSED + TABS zone is active ──────────────
  // Opens the menu; stopImmediatePropagation prevents global nav from also
  // firing onTabActivate for the same Enter press.
  useEffect(() => {
    if (isMenuOpen || focusedTabIndex === -1) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setFocusedMenuIndex(Math.max(0, focusedTabIndexRef.current));
      setIsMenuOpen(true);
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isMenuOpen, focusedTabIndex]);

  // ── Navigate within menu when it is OPEN ─────────────────────────────────
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
          handleMobileTabClickRef.current(APP_VIEW_TABS[focusedMenuIndexRef.current]);
          break;
        case 'Escape':
          e.preventDefault();
          e.stopImmediatePropagation();
          setIsMenuOpen(false);
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

  // Close menu if viewport resizes past the md breakpoint
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= MD_BREAKPOINT_PX) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMenuOpen, focusedMenuIndex, toggleMenu, handleMobileTabClick };
}
