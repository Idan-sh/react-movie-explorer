/**
 * FavoriteToggleButton Component
 *
 * Full labeled button for the movie details page.
 * Always visible — contrasts with the card overlay which shows on hover.
 */

import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export interface FavoriteToggleButtonProps {
  isFavorited: boolean;
  onClick: () => void;
}

export function FavoriteToggleButton({ isFavorited, onClick }: FavoriteToggleButtonProps): React.JSX.Element {
  const Icon = isFavorited ? HeartSolid : HeartOutline;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-sm font-medium
        transition-colors duration-150
        ${isFavorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
      `}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {isFavorited ? 'Favorited' : 'Add to Favorites'}
    </button>
  );
}
