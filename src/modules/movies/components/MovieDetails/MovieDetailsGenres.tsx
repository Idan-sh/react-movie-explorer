/**
 * MovieDetailsGenres Component
 *
 * Genre pill badges.
 */

import type { TmdbMovieDetails } from '../../types';

interface MovieDetailsGenresProps {
  details: TmdbMovieDetails;
}

export function MovieDetailsGenres({
  details,
}: MovieDetailsGenresProps): React.JSX.Element | null {
  if (!details.genres?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {details.genres.map((genre) => (
        <span
          key={genre.id}
          className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary dark:bg-primary/20"
        >
          {genre.name}
        </span>
      ))}
    </div>
  );
}
