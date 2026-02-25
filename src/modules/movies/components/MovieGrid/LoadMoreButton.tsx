/**
 * LoadMoreButton Component
 *
 * Pagination control displayed below the movie grid.
 * Keyboard-navigable via data-nav-id (part of the navigation system).
 * Handles three visual states: idle, loading, and error (retry).
 */

export interface LoadMoreButtonProps {
  isLoading: boolean;
  hasError: boolean;
  isFocused: boolean;
  navId: string;
  onClick: () => void;
}

export function LoadMoreButton({
  isLoading,
  hasError,
  isFocused,
  navId,
  onClick,
}: LoadMoreButtonProps): React.JSX.Element {
  const label = hasError ? "Retry" : "Load More";

  const focusRing = isFocused
    ? "ring-2 ring-primary"
    : "focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="flex justify-center pt-6 pb-2">
      <button
        type="button"
        tabIndex={-1}
        data-nav-id={navId}
        onClick={onClick}
        disabled={isLoading}
        className={`min-h-10 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white
          transition-colors duration-150 ease-in-out
          hover:bg-primary-hover
          outline-none ${focusRing}
          disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Loading...
          </span>
        ) : (
          label
        )}
      </button>
    </div>
  );
}
