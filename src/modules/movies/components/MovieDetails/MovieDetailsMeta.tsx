/**
 * MovieDetailsMeta Component
 *
 * Rating, release year, runtime, budget, and revenue row.
 * Receives pre-formatted values only — no data transformation.
 */

import { CircularMovieRating } from '../CircularMovieRating';

export interface MovieDetailsMetaProps {
  rating: number | null;
  year: string;
  runtime: string | null;
  budget: string | null;
  revenue: string | null;
  actionSlot?: React.ReactNode;
}

export function MovieDetailsMeta({
  rating,
  year,
  runtime,
  budget,
  revenue,
  actionSlot,
}: MovieDetailsMetaProps): React.JSX.Element {
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
