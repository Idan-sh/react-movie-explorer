/**
 * MovieDetailsMeta Component
 *
 * Rating, release year, and runtime row.
 */

import { CircularMovieRating } from '../CircularMovieRating';
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
      {rating !== null ? (
        <CircularMovieRating rating={rating} size="lg" />
      ) : (
        <span className="italic">No rating available yet</span>
      )}
      <span>{year}</span>
      {runtime && <span>{runtime}</span>}
    </div>
  );
}
