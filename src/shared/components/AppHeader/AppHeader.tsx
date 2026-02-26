/**
 * AppHeader Component
 *
 * Main application header with branding and category tabs.
 * Desktop: horizontal tab bar. Mobile: hamburger menu with vertical dropdown.
 * Uses useHamburgerMenu hook for mobile menu state management.
 */

import type { AppView } from '@/shared/types';
import { useHamburgerMenu } from '@/shared/hooks';
import { CategoryTabs } from '../CategoryTabs';
import { HamburgerButton } from './HamburgerButton';
import { MobileMenu } from './MobileMenu';

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
  onTabBlur,
}: AppHeaderProps): React.JSX.Element {
  const { isMenuOpen, focusedMenuIndex, toggleMenu, handleMobileTabClick } = useHamburgerMenu(onTabClick, focusedTabIndex);

  return (
    <header className="relative z-10 shrink-0 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎬 Movie Explorer
        </h1>

        {/* Desktop: horizontal tabs */}
        <div className="hidden md:block">
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
