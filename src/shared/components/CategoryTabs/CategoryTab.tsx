/**
 * CategoryTab Component
 *
 * Single tab button with animated underline indicator.
 * Active tab shows a sliding underline via framer-motion layoutId.
 * Purely presentational.
 */

import { motion } from 'framer-motion';

const TAB_INDICATOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 35 } as const;

export interface CategoryTabProps {
  label: string;
  isActive: boolean;
  isFocused: boolean;
  navId: string;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function CategoryTab({
  label,
  isActive,
  isFocused,
  navId,
  onClick,
  onFocus,
  onBlur,
}: CategoryTabProps): React.JSX.Element {
  return (
    <button
      role="tab"
      tabIndex={-1}
      aria-selected={isActive}
      data-nav-id={navId}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`
        relative flex items-center px-4 text-base font-medium
        transition-colors duration-200
        outline-none cursor-pointer
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
