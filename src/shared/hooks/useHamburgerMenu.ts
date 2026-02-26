/**
 * useHamburgerMenu Hook
 *
 * Manages mobile hamburger menu open/close state.
 * Wraps the tab click handler to auto-close the menu on selection.
 * Closes the menu when the viewport resizes to desktop width.
 */

import { useState, useCallback, useEffect } from 'react';
import type { AppView } from '@/shared/types';

const MD_BREAKPOINT_PX = 768;

export interface UseHamburgerMenuReturn {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  handleMobileTabClick: (view: AppView) => void;
}

export function useHamburgerMenu(
  onTabClick: (view: AppView) => void
): UseHamburgerMenuReturn {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return { isMenuOpen, toggleMenu, handleMobileTabClick };
}
