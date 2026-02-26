/**
 * MobileMenu Component
 *
 * Dropdown menu for mobile navigation.
 * Renders category tabs in a vertical list.
 * Positioned absolutely to overlay content without layout shift.
 * Hidden on desktop (md+).
 */

import type { AppView } from '@/shared/types';
import { APP_VIEW_TABS, APP_VIEW_LABELS } from '@/shared/constants';

export interface MobileMenuProps {
  isOpen: boolean;
  activeView: AppView;
  onTabClick: (view: AppView) => void;
}

export function MobileMenu({
  isOpen,
  activeView,
  onTabClick,
}: MobileMenuProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <nav
      aria-label="Category tabs"
      className="
        absolute left-0 right-0 z-20 md:hidden
        border-t border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800 shadow-lg
        px-4 py-2
      "
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-1">
        {APP_VIEW_TABS.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => onTabClick(view)}
            className={`
              w-full text-left rounded-md px-4 py-3
              text-sm font-medium cursor-pointer
              transition-colors duration-150 ease-in-out
              outline-none focus-visible:ring-2 focus-visible:ring-primary
              ${activeView === view
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {APP_VIEW_LABELS[view]}
          </button>
        ))}
      </div>
    </nav>
  );
}
