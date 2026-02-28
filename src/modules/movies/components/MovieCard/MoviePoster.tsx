/**
 * MoviePoster Component
 *
 * Displays movie poster image with lazy loading.
 * Shows placeholder when no image available.
 */

import { FilmPlaceholder } from "@/shared/components";

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
        <FilmPlaceholder iconSize="h-30 w-30" />
      )}
    </div>
  );
}
