/**
 * MovieCard Component
 *
 * Composes sub-components to display a movie card.
 * Purely presentational - all logic in useMovieCard hook.
 */

import { memo } from 'react';
import type { TmdbMovie } from '../../types';
import { useMovieCard } from '../../hooks';
import { MoviePoster } from './MoviePoster';
import { MovieInfo } from './MovieInfo';
import { FavoriteButton } from './FavoriteButton';
import { CircularMovieRating } from '../CircularMovieRating';

export interface MovieCardProps {
  movie: TmdbMovie;
  onSelect?: (movie: TmdbMovie) => void;
  isFocused?: boolean;
  navId?: string;
  isFavorited?: boolean;
  onToggleFavorite?: (movie: TmdbMovie) => void;
}

function MovieCardComponent({
  movie,
  onSelect,
  isFocused = false,
  navId,
  isFavorited = false,
  onToggleFavorite,
}: MovieCardProps): React.JSX.Element {
  const {
    posterUrl,
    releaseDate,
    rating,
    title,
    ariaLabel,
    handleClick,
    handleToggleFavorite,
  } = useMovieCard(movie, onSelect, onToggleFavorite, isFavorited);

  return (
    <article
      tabIndex={-1}
      data-nav-id={navId}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`
        group relative flex flex-col overflow-hidden rounded-md
        bg-white dark:bg-gray-800
        shadow-md hover:shadow-lg
        transition-all duration-150 ease-in-out
        outline-none
        ${isFocused ? 'ring-2 ring-primary scale-105' : ''}
      `}
    >
      {/* Poster with Rating + Favorite Overlay */}
      <div className="relative">
        <MoviePoster url={posterUrl} title={title} />
        {rating !== null && (
          <div className="absolute -bottom-4 left-2 z-10" aria-hidden="true">
            <CircularMovieRating rating={rating} size="sm" />
          </div>
        )}
        {onToggleFavorite !== undefined && (
          <FavoriteButton
            isFavorited={isFavorited}
            isFocused={isFocused}
            onClick={handleToggleFavorite}
          />
        )}
      </div>

      {/* Movie Details */}
      <MovieInfo title={title} releaseDate={releaseDate} />
    </article>
  );
}

/**
 * Memoized MovieCard - prevents re-render when props unchanged.
 * Key optimization for list rendering performance.
 */
export const MovieCard = memo(MovieCardComponent);
