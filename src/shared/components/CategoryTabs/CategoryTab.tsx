/**
 * CategoryTab Component
 *
 * Single tab button with animated underline indicator.
 * Active tab shows a sliding underline via framer-motion layoutId.
 * Purely presentational.
 */

import { motion } from 'framer-motion';
import type { AppView } from '@/shared/types';

const TAB_INDICATOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 35 } as const;

export interface CategoryTabProps {
  view: AppView;
  label: string;
  isActive: boolean;
  isFocused: boolean;
  navId: string;
  onTabClick: (view: AppView) => void;
  onTabFocus: (view: AppView) => void;
  onBlur: () => void;
}

export function CategoryTab({
  view,
  label,
  isActive,
  isFocused,
  navId,
  onTabClick,
  onTabFocus,
  onBlur,
}: CategoryTabProps): React.JSX.Element {
  const handleClick = (): void => onTabClick(view);
  const handleFocus = (): void => onTabFocus(view);

  return (
    <button
      role="tab"
      tabIndex={-1}
      aria-selected={isActive}
      data-nav-id={navId}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={onBlur}
      className={`
        relative flex items-center px-4 text-base font-medium
        transition-colors duration-200
        outline-none
        ${isFocused
          ? 'bg-primary/10 dark:bg-primary/15 text-primary'
          : ''
        }
        ${isActive
          ? 'text-primary'
          : isFocused
            ? ''
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }
      `}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="active-tab-indicator"
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
          transition={TAB_INDICATOR_TRANSITION}
        />
      )}
    </button>
  );
}
