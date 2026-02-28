/**
 * MovieDetailsPoster Component
 *
 * Large poster image for the details page, with a placeholder fallback.
 * Falls back to placeholder on missing poster or image load failure.
 * Hidden on small screens.
 */

import { useState, useCallback } from 'react';
import type { TmdbMovieDetails } from '../../types';
import { getPosterUrl } from '../../utils';
import { FilmPlaceholder } from '@/shared/components';

interface MovieDetailsPosterProps {
  movie: TmdbMovieDetails;
}

function PosterPlaceholder(): React.JSX.Element {
  return (
    <div className="hidden sm:block w-44 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-[2/3]">
      <FilmPlaceholder iconSize="h-12 w-12" />
    </div>
  );
}

export function MovieDetailsPoster({ movie }: MovieDetailsPosterProps): React.JSX.Element {
  const posterUrl = getPosterUrl(movie.poster_path);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((): void => {
    setHasError(true);
  }, []);

  if (!posterUrl || hasError) {
    return <PosterPlaceholder />;
  }

  return (
    <img
      src={posterUrl}
      alt={`${movie.title} poster`}
      onError={handleError}
      className="hidden sm:block w-44 shrink-0 rounded-lg object-cover shadow-md aspect-[2/3]"
    />
  );
}
