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
import { MovieRating } from './MovieRating';
import { MovieInfo } from './MovieInfo';

export interface MovieCardProps {
  movie: TmdbMovie;
  onSelect?: (movie: TmdbMovie) => void;
  isFocused?: boolean;
}

function MovieCardComponent({
  movie,
  onSelect,
  isFocused = false,
}: MovieCardProps): React.JSX.Element {
  const {
    posterUrl,
    releaseYear,
    rating,
    title,
    ariaLabel,
    handleClick,
    handleKeyDown,
  } = useMovieCard(movie, onSelect);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={`
        group relative flex flex-col overflow-hidden rounded-md
        bg-white dark:bg-gray-800
        shadow-md hover:shadow-lg
        transition-all duration-150 ease-in-out
        cursor-pointer outline-none
        ${isFocused
          ? 'ring-2 ring-primary scale-105'
          : 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:scale-105'
        }
      `}
    >
      {/* Poster with Rating Overlay */}
      <div className="relative">
        <MoviePoster url={posterUrl} title={title} />
        <MovieRating rating={rating} />
      </div>

      {/* Movie Details */}
      <MovieInfo title={title} releaseYear={releaseYear} />
    </article>
  );
}

/**
 * Memoized MovieCard - prevents re-render when props unchanged.
 * Key optimization for list rendering performance.
 */
export const MovieCard = memo(MovieCardComponent);
