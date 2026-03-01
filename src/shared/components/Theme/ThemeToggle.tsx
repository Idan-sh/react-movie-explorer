/**
 * ThemeToggle Component
 *
 * Icon button that switches between light and dark mode.
 * Shows a sun icon in light mode, half-moon in dark mode.
 */

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  navId?: string;
  isFocused?: boolean;
}

export function ThemeToggle({
  isDark,
  onToggle,
  navId,
  isFocused = false,
}: ThemeToggleProps): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      data-nav-id={navId}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        flex h-9 w-9 items-center justify-center rounded-lg outline-none
        text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
        hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors
        ${isFocused ? 'ring-2 ring-primary' : ''}
      `}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}
