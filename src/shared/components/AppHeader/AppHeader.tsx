/**
 * AppHeader Component
 *
 * Main application header with branding and category tabs.
 * Desktop: horizontal tab bar with animated underline indicator.
 * Mobile: hamburger menu with vertical dropdown.
 * Uses glassmorphism (backdrop-blur + semi-transparent bg) for depth.
 */

import type { AppView } from "@/shared/types";
import { useHamburgerMenu } from "@/shared/hooks";
import { CategoryTabs } from "../CategoryTabs";
import { HamburgerButton } from "./HamburgerButton";
import { MobileMenu } from "./MobileMenu";

export interface AppHeaderProps {
  activeView: AppView;
  focusedTabIndex: number;
  onTabClick: (view: AppView) => void;
  onTabFocus: (view: AppView) => void;
  onTabBlur: () => void;
}

export function AppHeader({
  activeView,
  focusedTabIndex,
  onTabClick,
  onTabFocus,
  onTabBlur
}: AppHeaderProps): React.JSX.Element {
  const { isMenuOpen, focusedMenuIndex, toggleMenu, handleMobileTabClick } = useHamburgerMenu(
    onTabClick,
    focusedTabIndex
  );

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-10 px-6">
        {/* Branding */}
        <div className="flex items-center gap-3.5">
          <svg className="h-9 w-9 shrink-0 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
          </svg>
          <h1 className="font-heading text-3xl leading-none translate-y-px font-bold uppercase tracking-tight text-gray-900 dark:text-white">
            Movie Explorer
          </h1>
        </div>

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

        {/* Mobile: hamburger toggle */}
        <HamburgerButton
          isOpen={isMenuOpen}
          isFocused={focusedTabIndex !== -1 && !isMenuOpen}
          onClick={toggleMenu}
        />
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
