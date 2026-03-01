/**
 * LoadMoreButton Component
 *
 * Pagination control displayed below the movie grid.
 * Keyboard-navigable via data-nav-id (part of the navigation system).
 * Handles two visual states: idle and error (retry).
 *
 * Uses a ghost/outline style with a gradient separator line to stay
 * visually secondary to the movie grid content above.
 */

export interface LoadMoreButtonProps {
  hasError: boolean;
  isFocused: boolean;
  navId: string;
  onClick: () => void;
}

export function LoadMoreButton({
  hasError,
  isFocused,
  navId,
  onClick,
}: LoadMoreButtonProps): React.JSX.Element {
  const label = hasError ? 'Retry' : 'Load More';

  return (
    <div className="flex flex-col items-center gap-5 pt-8 pb-4">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      <button
        type="button"
        tabIndex={-1}
        data-nav-id={navId}
        onClick={onClick}
        className={`
          group flex min-h-11 items-center gap-2.5 rounded-lg
          border border-gray-300 dark:border-gray-600
          px-8 py-2.5 text-sm font-medium
          text-gray-700 dark:text-gray-200
          outline-none
          transition-all duration-300
          hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white
          ${
            isFocused
              ? 'border-primary text-primary bg-primary/10 dark:border-primary-light dark:text-primary-light dark:bg-primary/15'
              : 'focus-visible:border-primary focus-visible:text-primary focus-visible:bg-primary/10'
          }
        `}
      >
        {label}
      </button>
    </div>
  );
}
