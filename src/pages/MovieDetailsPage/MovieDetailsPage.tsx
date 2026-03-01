/**
 * MovieDetailsPage
 *
 * Route: /movie/:id
 *
 * Full-page layout for movie details. Uses useMovieDetailsPage() for data and nav.
 * STATES: Loading → skeleton; Error → message + back; Success → full details layout.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMovieDetailsPage,
  getBackdropUrl,
  getPosterUrl,
  MovieDetailsBackdrop,
  MovieDetailsPoster,
  MovieDetailsMeta,
  MovieDetailsGenres,
  MovieDetailsOverview,
  MovieDetailsCast,
  MovieTrailer,
  MovieRecommendations,
  MovieDetailsSkeleton,
  FavoriteToggleButton,
} from '@/modules/movies';
import { buildNavId, NAV_ID_PREFIX } from '@/core/navigation';
import { BackButton, NotFoundView } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

export function MovieDetailsPage(): React.JSX.Element {
  const {
    details,
    isLoading,
    error,
    display,
    isFavorited,
    onBack,
    onToggleFavorite,
    focusedItemIndex = -1,
  } = useMovieDetailsPage();

  const navigate = useNavigate();
  const handleGoHome = useCallback((): void => {
    navigate(ROUTES.HOME, { viewTransition: true });
  }, [navigate]);

  if (error) {
    return (
      <NotFoundView
        title="Movie not found"
        message={error}
        ctaLabel="Go to Home"
        onCta={handleGoHome}
        onGoBack={onBack}
      />
    );
  }

  if (isLoading || !details) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        <div className="mb-4">
          <BackButton
            onClick={onBack}
            navId={buildNavId(NAV_ID_PREFIX.ITEM, 0, 0)}
            isFocused={focusedItemIndex === 0}
          />
        </div>
        <MovieDetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-16">
      <div className="mb-4">
        <BackButton
          onClick={onBack}
          navId={buildNavId(NAV_ID_PREFIX.ITEM, 0, 0)}
          isFocused={focusedItemIndex === 0}
        />
      </div>

      <MovieDetailsBackdrop url={getBackdropUrl(details.backdrop_path)} />

      <div className="flex items-start gap-6">
        <MovieDetailsPoster
          url={getPosterUrl(details.poster_path)}
          title={details.title}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
            {details.title}
          </h1>
          {display && (
            <MovieDetailsMeta
              {...display.meta}
              actionSlot={
                <FavoriteToggleButton
                  isFavorited={isFavorited}
                  onClick={onToggleFavorite}
                />
              }
            />
          )}
          <MovieDetailsGenres details={details} />
          <MovieDetailsOverview details={details} />
        </div>
      </div>

      {display?.cast && (
        <div className="mt-8">
          <MovieDetailsCast
            director={display.cast.director}
            cast={display.cast.cast}
          />
        </div>
      )}

      {details.videos && (
        <div className="mt-8">
          <MovieTrailer videos={details.videos.results} />
        </div>
      )}

      {details.recommendations &&
        details.recommendations.results.length > 0 && (
          <div className="mt-8">
            <MovieRecommendations movies={details.recommendations.results} />
          </div>
        )}
    </div>
  );
}
