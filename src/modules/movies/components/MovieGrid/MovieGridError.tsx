/**
 * MovieGridError Component
 *
 * Displays error message when movie fetch fails.
 */

export interface MovieGridErrorProps {
  message: string | null;
}

export function MovieGridError({
  message,
}: MovieGridErrorProps): React.JSX.Element {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-error">
      <span className="text-4xl mb-4">⚠️</span>
      <p className="text-lg font-medium">Something went wrong</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {message || 'Failed to load movies. Please try again.'}
      </p>
    </div>
  );
}
