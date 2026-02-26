/**
 * MovieDetailsMeta Component
 *
 * Rating, release year, and runtime row.
 */

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
      <span className="flex items-center gap-1 font-medium text-yellow-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {rating}
      </span>
      <span>{year}</span>
      {runtime && <span>{runtime}</span>}
    </div>
  );
}
