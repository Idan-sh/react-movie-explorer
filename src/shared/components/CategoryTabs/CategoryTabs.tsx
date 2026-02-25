/**
 * CategoryTabs Component
 *
 * Tab bar for switching between app views.
 * Purely presentational - receives state and handlers via props.
 */

import type { AppView } from '@/shared/types';
import { APP_VIEW_TABS, APP_VIEW_LABELS } from '@/shared/constants';
import { buildNavId, NAV_ID_PREFIX } from '@/modules/navigation';
import { CategoryTab } from './CategoryTab';

export interface CategoryTabsProps {
  activeView: AppView;
  focusedTabIndex: number;
  onTabClick: (view: AppView) => void;
  onTabFocus: (view: AppView) => void;
  onTabBlur: () => void;
}

export function CategoryTabs({
  activeView,
  focusedTabIndex,
  onTabClick,
  onTabFocus,
  onTabBlur,
}: CategoryTabsProps): React.JSX.Element {
  return (
    <nav role="tablist" aria-label="Category tabs" className="flex gap-2">
      {APP_VIEW_TABS.map((view, index) => (
        <CategoryTab
          key={view}
          label={APP_VIEW_LABELS[view]}
          isActive={activeView === view}
          isFocused={index === focusedTabIndex}
          navId={buildNavId(NAV_ID_PREFIX.TAB, index)}
          onClick={() => onTabClick(view)}
          onFocus={() => onTabFocus(view)}
          onBlur={onTabBlur}
        />
      ))}
    </nav>
  );
}
