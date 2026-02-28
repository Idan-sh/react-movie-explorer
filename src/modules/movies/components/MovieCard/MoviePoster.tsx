/**
 * MoviePoster Component
 *
 * Displays movie poster image with lazy loading.
 * Shows placeholder when no image available or when load fails.
 */

import { FilmPlaceholder } from "@/shared/components";
import { usePosterImage } from "../../hooks";

export interface MoviePosterProps {
  url: string | null;
  title: string;
}

export function MoviePoster({ url, title }: MoviePosterProps): React.JSX.Element {
  const { showPlaceholder, handleError } = usePosterImage(url);

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      {showPlaceholder ? (
        <FilmPlaceholder iconSize="h-32 w-32" />
      ) : (
        <img
          src={url!}
          alt={`${title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
          onError={handleError}
        />
      )}
    </div>
  );
}
