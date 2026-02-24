/**
 * MoviePoster Component
 *
 * Displays movie poster image with lazy loading.
 * Shows placeholder when no image available.
 */

export interface MoviePosterProps {
  url: string | null;
  title: string;
}

export function MoviePoster({ url, title }: MoviePosterProps): React.JSX.Element {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      {url ? (
        <img
          src={url}
          alt={`${title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
          <span className="text-sm">No Image</span>
        </div>
      )}
    </div>
  );
}
