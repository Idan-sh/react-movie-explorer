/**
 * AppHeader Component
 *
 * Main application header with branding and category tabs.
 * Presentational - receives tab state via props.
 */

import type { AppView } from '@/shared/types';
import { CategoryTabs } from '../CategoryTabs';

export interface AppHeaderProps {
  activeView: AppView;
  onTabClick: (view: AppView) => void;
  onTabFocus: (view: AppView) => void;
  onTabBlur: () => void;
}

export function AppHeader({
  activeView,
  onTabClick,
  onTabFocus,
  onTabBlur,
}: AppHeaderProps): React.JSX.Element {
  return (
    <header className="shrink-0 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎬 Movie Explorer
        </h1>

        <CategoryTabs
          activeView={activeView}
          onTabClick={onTabClick}
          onTabFocus={onTabFocus}
          onTabBlur={onTabBlur}
        />
      </div>
    </header>
  );
}
