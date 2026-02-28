/**
 * MovieDetailsMeta Component
 *
 * Rating, release year, and runtime row.
 */

import { StarIcon } from '@heroicons/react/20/solid';
import type { TmdbMovieDetails } from '../../types';
import { formatRating, getReleaseYear, formatRuntime } from '../../utils';

interface MovieDetailsMetaProps {
  details: TmdbMovieDetails;
}

export function MovieDetailsMeta({ details }: MovieDetailsMetaProps): React.JSX.Element {
  const rating = formatRating(details.vote_average);
  const year = getReleaseYear(details.release_date);
  const runtime = formatRuntime(details.runtime);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
      {rating ? (
        <span className="flex items-center gap-1 font-medium text-yellow-500">
          <StarIcon className="h-4 w-4" aria-hidden="true" />
          {rating}
        </span>
      ) : (
        <span className="italic">No rating available yet</span>
      )}
      <span>{year}</span>
      {runtime && <span>{runtime}</span>}
    </div>
  );
}
