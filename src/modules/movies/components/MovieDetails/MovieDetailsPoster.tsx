/**
 * MovieDetailsPoster Component
 *
 * Large poster image for the details page, with a placeholder fallback.
 * Hidden on small screens.
 */

import { FilmIcon } from '@heroicons/react/24/outline';
import type { TmdbMovieDetails } from '../../types';
import { getPosterUrl } from '../../utils';

interface MovieDetailsPosterProps {
  movie: TmdbMovieDetails;
}

export function MovieDetailsPoster({ movie }: MovieDetailsPosterProps): React.JSX.Element {
  const posterUrl = getPosterUrl(movie.poster_path);

  if (!posterUrl) {
    return (
      <div className="hidden sm:flex w-44 shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[2/3]">
        <FilmIcon className="h-10 w-10 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={`${movie.title} poster`}
      className="hidden sm:block w-44 shrink-0 rounded-lg object-cover shadow-md aspect-[2/3]"
    />
  );
}
