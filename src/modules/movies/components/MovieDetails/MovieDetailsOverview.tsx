/**
 * MovieDetailsOverview Component
 *
 * Tagline (italic) and overview paragraph.
 */

import type { TmdbMovieDetails } from '../../types';

interface MovieDetailsOverviewProps {
  details: TmdbMovieDetails;
}

export function MovieDetailsOverview({ details }: MovieDetailsOverviewProps): React.JSX.Element | null {
  if (!details.overview && !details.tagline) return null;

  return (
    <div className="flex flex-col gap-2">
      {details.tagline && (
        <p className="text-sm italic text-gray-500 dark:text-gray-400">
          "{details.tagline}"
        </p>
      )}
      {details.overview && (
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {details.overview}
        </p>
      )}
    </div>
  );
}
