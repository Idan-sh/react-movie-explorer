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

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { TmdbMovieDetails } from "../../types";
import { getBackdropUrl } from "../../utils";
import { MovieDetailsPoster } from "./MovieDetailsPoster";
import { MovieDetailsMeta } from "./MovieDetailsMeta";
import { MovieDetailsGenres } from "./MovieDetailsGenres";
import { MovieDetailsOverview } from "./MovieDetailsOverview";
import { MovieDetailsCast } from "./MovieDetailsCast";
import { MovieDetailsTrailer } from "./MovieDetailsTrailer";
import { MovieDetailsRecommendations } from "./MovieDetailsRecommendations";
import { FavoriteToggleButton } from "./FavoriteToggleButton";
import { buildNavId, NAV_ID_PREFIX } from "@/modules/navigation";

interface MovieDetailsProps {
  details: TmdbMovieDetails | null;
  isLoading: boolean;
  error: string | null;
  isFavorited: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  /** Index of the focused action button (-1 = none, 0 = back, 1 = favorite) */
  focusedItemIndex?: number;
}

function BackButton({
  onClick,
  navId,
  isFocused = false
}: {
  onClick: () => void;
  navId?: string;
  isFocused?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      data-nav-id={navId}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 text-sm font-medium outline-none
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        transition-colors rounded-sm
        ${isFocused ? "ring-2 ring-primary" : ""}
      `}
    >
      <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      Back
    </button>
  );
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse">
      {/* Backdrop: h-48 sm:h-64 rounded-lg */}
      <div className="h-48 sm:h-64 rounded-lg bg-gray-200 dark:bg-gray-700 mb-6" />

      <div className="flex items-start gap-6">
        {/* Poster: hidden sm:block w-44 aspect-[2/3] */}
        <div className="hidden sm:block w-44 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 aspect-[2/3]" />

        {/* Right column: matches flex flex-col gap-3 */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Title: text-2xl font-bold ≈ h-8 */}
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

          {/* Meta: CircularMovieRating lg (h-14 w-14) + year + runtime inline */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Genres: rounded-full py-0.5 text-xs ≈ h-5 */}
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* FavoriteToggleButton: rounded-full px-4 py-1.5 text-sm ≈ h-8 */}
          <div className="h-8 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />

          {/* Overview: tagline (italic) + overview lines */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Cast section */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex w-24 shrink-0 flex-col items-center gap-1.5">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Trailer section */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function MovieDetails({
  details,
  isLoading,
  error,
  isFavorited,
  onBack,
  onToggleFavorite,
  focusedItemIndex = -1
}: MovieDetailsProps): React.JSX.Element {
  const backdropUrl = details ? getBackdropUrl(details.backdrop_path) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4">
        <BackButton
          onClick={onBack}
          navId={buildNavId(NAV_ID_PREFIX.ITEM, 0, 0)}
          isFocused={focusedItemIndex === 0}
        />
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
          {backdropUrl && (
            <div className="relative mb-6 h-48 sm:h-64 overflow-hidden rounded-lg">
              <img
                src={backdropUrl}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />
            </div>
          )}

          <div className="flex items-start gap-6">
            <MovieDetailsPoster movie={details} />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
                  {details.title}
                </h1>
                <FavoriteToggleButton isFavorited={isFavorited} onClick={onToggleFavorite} />
              </div>

              <MovieDetailsMeta details={details} />
              <MovieDetailsGenres details={details} />
              <MovieDetailsOverview details={details} />
            </div>
          </div>

          {details.credits && (
            <div className="mt-8">
              <MovieDetailsCast
                cast={details.credits.cast}
                crew={details.credits.crew}
              />
            </div>
          )}

          {details.videos && (
            <div className="mt-8">
              <MovieDetailsTrailer videos={details.videos.results} />
            </div>
          )}

          {details.recommendations && details.recommendations.results.length > 0 && (
            <div className="mt-8">
              <MovieDetailsRecommendations movies={details.recommendations.results} />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
