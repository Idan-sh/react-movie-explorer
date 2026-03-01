import { useRouteError } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function RouteErrorFallback(): React.JSX.Element {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error('Route error:', error);
  }

  const handleReload = (): void => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <ExclamationTriangleIcon className="h-12 w-12 text-warning" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        An unexpected error occurred. Please try reloading the page.
      </p>
      <button
        type="button"
        onClick={handleReload}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
}
