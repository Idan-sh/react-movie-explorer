/**
 * MovieDetailsBackdrop Component
 *
 * Hero backdrop image with gradient overlay.
 * Falls back to a film-pattern placeholder when no image is available
 * or the image fails to load.
 */

import { useState, useCallback } from 'react';
import { FilmPlaceholder } from '@/shared/components';

interface MovieDetailsBackdropProps {
  url: string | null;
}

function BackdropPlaceholder(): React.JSX.Element {
  return (
    <div className="mb-6 h-32 sm:h-48 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
      <FilmPlaceholder iconSize="h-16 w-16" />
    </div>
  );
}

export function MovieDetailsBackdrop({ url }: MovieDetailsBackdropProps): React.JSX.Element {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((): void => {
    setHasError(true);
  }, []);

  if (!url || hasError) {
    return <BackdropPlaceholder />;
  }

  return (
    <div className="relative mb-6 h-48 sm:h-64 overflow-hidden rounded-lg">
      <img
        src={url}
        alt=""
        aria-hidden="true"
        onError={handleError}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
    </div>
  );
}
