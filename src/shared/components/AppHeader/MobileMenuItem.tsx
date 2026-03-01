import type { AppView } from '@/shared/types';
import { APP_VIEW_CONFIG } from '@/shared/constants';
import { buildNavId, NAV_ID_PREFIX } from '@/core/navigation';

interface MobileMenuItemProps {
  view: AppView;
  index: number;
  isActive: boolean;
  isFocused: boolean;
  onTabClick: (view: AppView) => void;
}

export function MobileMenuItem({
  view,
  index,
  isActive,
  isFocused,
  onTabClick,
}: MobileMenuItemProps): React.JSX.Element {
  const handleClick = (): void => {
    onTabClick(view);
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      data-nav-id={buildNavId(NAV_ID_PREFIX.TAB, index)}
      onClick={handleClick}
      className={`
        w-full text-left rounded-lg px-4 py-3
        text-sm font-medium
        transition-colors duration-200
        outline-none
        ${isFocused ? 'ring-2 ring-primary rounded-lg' : ''}
        ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
        }
      `}
    >
      {APP_VIEW_CONFIG[view].label}
    </button>
  );
}
