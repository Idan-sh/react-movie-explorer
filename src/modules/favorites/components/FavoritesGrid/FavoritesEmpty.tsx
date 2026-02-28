/**
 * FavoritesEmpty Component
 *
 * Shown when the user has no favorited movies.
 */

import { HeartIcon } from '@heroicons/react/24/outline';

export function FavoritesEmpty(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
      <HeartIcon className="mb-4 h-16 w-16 opacity-40" />
      <p className="text-lg font-medium">No favorites yet</p>
      <p className="mt-1 text-sm">
        Click the heart on any movie to save it here
      </p>
    </div>
  );
}
