/**
 * MovieDetailsBackdrop Component
 *
 * Hero backdrop image with gradient overlay.
 * Falls back to a film-pattern placeholder when no image is available
 * or the image fails to load.
 */

import { FilmPlaceholder, ImageWithFallback } from '@/shared/components';

interface MovieDetailsBackdropProps {
  url: string | null;
}

function BackdropPlaceholder(): React.JSX.Element {
  return (
    <div className="h-full bg-gray-200 dark:bg-gray-700">
      <FilmPlaceholder iconSize="h-16 w-16" />
    </div>
  );
}

const backdropFallback = <BackdropPlaceholder />;

export function MovieDetailsBackdrop({
  url,
}: MovieDetailsBackdropProps): React.JSX.Element {
  return (
    <div className="relative mb-6 h-48 sm:h-64 overflow-hidden rounded-lg">
      <ImageWithFallback
        src={url ?? undefined}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
        fallback={backdropFallback}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100 dark:to-gray-900" />
    </div>
  );
}
