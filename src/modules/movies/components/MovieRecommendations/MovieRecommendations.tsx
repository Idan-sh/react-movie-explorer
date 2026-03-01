/**
 * MovieRecommendations Component
 *
 * Horizontal scrollable row of recommended movies using MovieCard.
 */

import type { TmdbMovie } from '../../types';
import { MovieCard } from '../MovieCard';
import { ScrollRow } from '@/shared/components';
import { useMovieRecommendations } from './useMovieRecommendations';

interface MovieRecommendationsProps {
  movies: TmdbMovie[];
}

export function MovieRecommendations({
  movies,
}: MovieRecommendationsProps): React.JSX.Element | null {
  const { displayMovies, handleSelect } = useMovieRecommendations(movies);

  if (displayMovies.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        More Like This
      </h2>

      <ScrollRow className="items-stretch">
        {displayMovies.map((movie) => (
          <div
            key={movie.id}
            className="w-36 shrink-0 [&_h3]:text-xs [&_h3]:line-clamp-1"
          >
            <MovieCard movie={movie} onSelect={handleSelect} />
          </div>
        ))}
      </ScrollRow>
    </div>
  );
}
