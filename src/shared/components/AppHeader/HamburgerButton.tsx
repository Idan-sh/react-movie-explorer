/**
 * HamburgerButton Component
 *
 * Toggle button for the mobile navigation menu.
 * Shows a hamburger icon when closed, X icon when open.
 * Hidden on desktop (md+).
 */

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export interface HamburgerButtonProps {
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
}

export function HamburgerButton({
  isOpen,
  isFocused,
  onClick,
}: HamburgerButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={`
        ml-auto md:hidden
        p-2.5 rounded-lg
        text-gray-600 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-800/60
        transition-colors duration-200
        outline-none
        ${isFocused ? 'ring-2 ring-primary' : 'focus-visible:ring-2 focus-visible:ring-primary'}
      `}
    >
      {isOpen ? (
        <XMarkIcon className="h-7 w-7" />
      ) : (
        <Bars3Icon className="h-7 w-7" />
      )}
    </button>
  );
}
