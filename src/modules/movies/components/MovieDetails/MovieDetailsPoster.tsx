/**
 * MovieDetailsPoster Component
 *
 * Large poster image for the details page, with a placeholder fallback.
 * Hidden on small screens.
 */

import { FilmPlaceholder, ImageWithFallback } from '@/shared/components';

interface MovieDetailsPosterProps {
  url: string | null;
  title: string;
}

function PosterPlaceholder(): React.JSX.Element {
  return (
    <div className="hidden sm:block w-44 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-[2/3]">
      <FilmPlaceholder iconSize="h-12 w-12" />
    </div>
  );
}

const posterFallback = <PosterPlaceholder />;

export function MovieDetailsPoster({
  url,
  title,
}: MovieDetailsPosterProps): React.JSX.Element {
  return (
    <ImageWithFallback
      src={url ?? undefined}
      alt={`${title} poster`}
      className="hidden sm:block w-44 shrink-0 rounded-lg object-cover shadow-md aspect-[2/3]"
      fallback={posterFallback}
    />
  );
}
