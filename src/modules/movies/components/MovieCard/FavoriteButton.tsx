/**
 * FavoriteButton Component
 *
 * Heart icon overlay on MovieCard poster.
 * Visible on hover, always visible when favorited or card is focused.
 */

import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export interface FavoriteButtonProps {
  isFavorited: boolean;
  isFocused: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function FavoriteButton({
  isFavorited,
  isFocused,
  onClick,
}: FavoriteButtonProps): React.JSX.Element {
  return (
    <button
      tabIndex={-1}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      onClick={onClick}
      className={`
        absolute top-2 left-2 z-10
        flex h-8 w-8 items-center justify-center rounded-full
        transition-all duration-150 ease-in-out
        hover:scale-110
        ${
          isFavorited
            ? 'bg-red-500 text-white opacity-100'
            : `bg-black/50 text-white opacity-0 group-hover:opacity-100 ${isFocused ? 'opacity-100' : ''}`
        }
      `}
    >
      {isFavorited ? (
        <HeartSolid className="h-4 w-4" />
      ) : (
        <HeartOutline className="h-4 w-4" />
      )}
    </button>
  );
}
