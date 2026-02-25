/**
 * CategoryTab Component
 *
 * Single tab button. Purely presentational.
 */

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
        rounded-full px-4 py-2 text-sm font-medium
        transition-colors duration-150 ease-in-out
        outline-none cursor-pointer
        ${isFocused
          ? 'ring-2 ring-primary'
          : 'focus-visible:ring-2 focus-visible:ring-primary'
        }
        ${isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
    >
      {label}
    </button>
  );
}
