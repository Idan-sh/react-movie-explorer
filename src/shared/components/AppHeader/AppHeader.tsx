/**
 * AppHeader Component
 *
 * Main application header with branding and category tabs.
 * Desktop: horizontal tab bar with animated underline indicator.
 * Mobile: hamburger menu with vertical dropdown.
 * Uses glassmorphism (backdrop-blur + semi-transparent bg) for depth.
 *
 * searchSlot: search bar (inline on desktop, second row on mobile).
 * actionsSlot: icon buttons (theme toggle, settings) — always in the top row.
 */

import { Link } from 'react-router-dom';

import type { AppView } from '@/shared/types';
import { useHamburgerMenu } from '@/shared/hooks';
import { ROUTES, Z_LAYER } from '@/shared/constants';
import { CategoryTabs } from '../CategoryTabs';
import { HamburgerButton } from './HamburgerButton';
import { MobileMenu } from './MobileMenu';

export interface AppHeaderProps {
  activeView: AppView;
  focusedTabIndex: number;
  onTabClick: (view: AppView) => void;
  onTabFocus: (view: AppView) => void;
  onTabBlur: () => void;
  searchSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
}

export function AppHeader({
  activeView,
  focusedTabIndex,
  onTabClick,
  onTabFocus,
  onTabBlur,
  searchSlot,
  actionsSlot,
}: AppHeaderProps): React.JSX.Element {
  const { isMenuOpen, focusedMenuIndex, toggleMenu, handleMobileTabClick } =
    useHamburgerMenu(onTabClick, focusedTabIndex);

  return (
    <header
      style={{ zIndex: Z_LAYER.HEADER }}
      className="sticky top-0 shrink-0 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-14 md:h-20 items-center gap-4 md:gap-10">
          {/* Branding */}
          <Link
            to={ROUTES.HOME}
            className="flex shrink-0 items-center gap-2 md:gap-3.5 cursor-pointer no-underline transition-transform duration-150 ease-in-out hover:scale-105"
          >
            <svg
              className="h-8 w-8 md:h-9 md:w-9 shrink-0 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
            <h1 className="font-heading text-lg sm:text-2xl md:text-3xl leading-none translate-y-px font-bold uppercase tracking-tight text-gray-900 dark:text-white">
              Movie Explorer
            </h1>
          </Link>

          {/* Desktop: horizontal tabs */}
          <div className="hidden md:flex h-full items-stretch">
            <CategoryTabs
              activeView={activeView}
              focusedTabIndex={focusedTabIndex}
              onTabClick={onTabClick}
              onTabFocus={onTabFocus}
              onTabBlur={onTabBlur}
            />
          </div>

          {/* Right side: search (desktop only), actions, hamburger — single HamburgerButton for both breakpoints */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-3">
            <div className="hidden md:block">{searchSlot}</div>
            {actionsSlot}
            <HamburgerButton
              isOpen={isMenuOpen}
              isFocused={focusedTabIndex !== -1 && !isMenuOpen}
              onClick={toggleMenu}
            />
          </div>
        </div>

        {/* Mobile: search on second row */}
        <div className="flex md:hidden pb-3">
          <div className="w-full">{searchSlot}</div>
        </div>
      </div>

      {/* Mobile: dropdown menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        activeView={activeView}
        focusedMenuIndex={focusedMenuIndex}
        onTabClick={handleMobileTabClick}
      />
    </header>
  );
}
