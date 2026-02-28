/**
 * MovieDetailsMeta Component
 *
 * Rating, release year, runtime, budget, and revenue row.
 */

import { CircularMovieRating } from "../CircularMovieRating";
import type { TmdbMovieDetails } from "../../types";
import { formatRating, getReleaseYear, formatRuntime, formatMoney } from "../../utils";

interface MovieDetailsMetaProps {
  details: TmdbMovieDetails;
  actionSlot?: React.ReactNode;
}

export function MovieDetailsMeta({
  details,
  actionSlot
}: MovieDetailsMetaProps): React.JSX.Element {
  const rating = formatRating(details.vote_average);
  const year = getReleaseYear(details.release_date);
  const runtime = formatRuntime(details.runtime);
  const budget = formatMoney(details.budget);
  const revenue = formatMoney(details.revenue);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
          {rating !== null ? (
            <CircularMovieRating rating={rating} size="lg" />
          ) : (
            <span className="italic">No rating available yet</span>
          )}
          <span>{year}</span>
          {runtime && <span>{runtime}</span>}
        </div>
        {actionSlot}
      </div>

      {(budget || revenue) && (
        <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-gray-400">
          {budget && <span>Budget: {budget}</span>}
          {revenue && <span>Revenue: {revenue}</span>}
        </div>
      )}
    </div>
  );
}
