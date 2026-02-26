/**
 * MovieDetails Component
 *
 * Full-page layout for movie details.
 * Receives fetched data as props — no Redux reads inside.
 *
 * STATES:
 * - Loading → skeleton backdrop + content placeholders
 * - Error   → error message with back button
 * - Success → full details layout
 */

import type { TmdbMovieDetails } from '../../types';
import { getBackdropUrl } from '../../utils';
import { MovieDetailsPoster } from './MovieDetailsPoster';
import { MovieDetailsMeta } from './MovieDetailsMeta';
import { MovieDetailsGenres } from './MovieDetailsGenres';
import { MovieDetailsOverview } from './MovieDetailsOverview';

interface MovieDetailsProps {
  details: TmdbMovieDetails | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

function BackButton({ onClick }: { onClick: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse">
      {/* Backdrop skeleton */}
      <div className="h-48 sm:h-64 rounded-lg bg-gray-200 dark:bg-gray-700 mb-6" />
      <div className="flex gap-6">
        {/* Poster skeleton */}
        <div className="hidden sm:block w-44 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[2/3]" />
        <div className="flex flex-1 flex-col gap-4">
          {/* Title skeleton */}
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          {/* Meta skeleton */}
          <div className="flex gap-3">
            <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-14 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Genre skeletons */}
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Overview skeleton lines */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieDetails({ details, isLoading, error, onBack }: MovieDetailsProps): React.JSX.Element {
  const backdropUrl = details ? getBackdropUrl(details.backdrop_path) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back button */}
      <div className="mb-4">
        <BackButton onClick={onBack} />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <BackButton onClick={onBack} />
        </div>
      ) : details ? (
        <>
          {/* Backdrop */}
          {backdropUrl && (
            <div className="relative mb-6 h-48 sm:h-64 overflow-hidden rounded-lg">
              <img src={backdropUrl} alt="" aria-hidden="true" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
            </div>
          )}

          {/* Poster + info */}
          <div className="flex gap-6">
            <MovieDetailsPoster movie={details} />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
                {details.title}
              </h1>

              <MovieDetailsMeta details={details} />
              <MovieDetailsGenres details={details} />
              <MovieDetailsOverview details={details} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
