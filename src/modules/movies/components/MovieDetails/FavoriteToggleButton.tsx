/**
 * FavoriteToggleButton Component
 *
 * Full labeled button for the movie details page.
 * Always visible — contrasts with the card overlay which shows on hover.
 */

export interface FavoriteToggleButtonProps {
  isFavorited: boolean;
  onClick: () => void;
}

export function FavoriteToggleButton({ isFavorited, onClick }: FavoriteToggleButtonProps): React.JSX.Element {
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isFavorited ? 0 : 2}
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {isFavorited ? 'Favorited' : 'Add to Favorites'}
    </button>
  );
}
