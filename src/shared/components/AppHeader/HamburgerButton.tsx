/**
 * HamburgerButton Component
 *
 * Toggle button for the mobile navigation menu.
 * Shows a hamburger icon when closed, X icon when open.
 * Hidden on desktop (md+).
 */

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
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={`
        ml-auto md:hidden
        p-2 rounded-md cursor-pointer
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors duration-150
        outline-none
        ${isFocused ? 'ring-2 ring-primary' : 'focus-visible:ring-2 focus-visible:ring-primary'}
      `}
    >
      {isOpen ? (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}
