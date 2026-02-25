/**
 * CategoryTabs Component
 *
 * Tab bar for switching between app views.
 * Purely presentational - receives state and handlers via props.
 */

import type { AppView, AppViewTab } from '@/shared/types';
import { APP_VIEW_TABS, APP_VIEW_LABELS } from '@/shared/constants';
import { CategoryTab } from './CategoryTab';

export interface CategoryTabsProps {
  activeView: AppView;
  onTabClick: (view: AppViewTab) => void;
  onTabFocus: (view: AppViewTab) => void;
  onTabBlur: () => void;
}

export function CategoryTabs({
  activeView,
  onTabClick,
  onTabFocus,
  onTabBlur,
}: CategoryTabsProps): React.JSX.Element {
  return (
    <nav role="tablist" aria-label="Category tabs" className="flex gap-2">
      {APP_VIEW_TABS.map((view) => (
        <CategoryTab
          key={view}
          label={APP_VIEW_LABELS[view]}
          isActive={activeView === view}
          onClick={() => onTabClick(view)}
          onFocus={() => onTabFocus(view)}
          onBlur={onTabBlur}
        />
      ))}
    </nav>
  );
}
