/**
 * MoviePoster Component
 *
 * Displays movie poster image with lazy loading.
 * Shows placeholder when no image available or when load fails.
 */

import { FilmPlaceholder, ImageWithFallback } from '@/shared/components';

export interface MoviePosterProps {
  url: string | null;
  title: string;
}

function PosterPlaceholder(): React.JSX.Element {
  return <FilmPlaceholder iconSize="h-32 w-32" />;
}

const posterFallback = <PosterPlaceholder />;

export function MoviePoster({
  url,
  title,
}: MoviePosterProps): React.JSX.Element {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      <ImageWithFallback
        src={url ?? undefined}
        alt={`${title} poster`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
        fallback={posterFallback}
      />
    </div>
  );
}
