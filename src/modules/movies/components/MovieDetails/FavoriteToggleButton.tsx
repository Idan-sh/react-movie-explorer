/**
 * FavoriteToggleButton Component
 *
 * Full labeled button for the movie details page.
 * Always visible — contrasts with the card overlay which shows on hover.
 */

import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

export interface FavoriteToggleButtonProps {
  isFavorited: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function FavoriteToggleButton({
  isFavorited,
  onClick
}: FavoriteToggleButtonProps): React.JSX.Element {
  const Icon = isFavorited ? HeartSolid : HeartOutline;

  return (
    <div className="relative">
      {/* Invisible sizer — always reserves space for the longer label */}
      <span className="invisible flex items-center gap-1.5 px-3 py-1 text-xs sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm font-medium" aria-hidden="true">
        Add to Favorites
        <HeartOutline className="h-4 w-4 shrink-0" />
      </span>

      <button
        type="button"
        onClick={onClick}
        className={`
          absolute inset-y-0 right-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm font-medium
          transition-colors duration-150
          ${
            isFavorited
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }
        `}
      >
        {isFavorited ? "Favorited" : "Add to Favorites"}
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
    </div>
  );
}
