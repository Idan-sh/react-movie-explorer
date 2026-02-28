/**
 * MovieDetailsRecommendations Component
 *
 * Horizontal scrollable row of recommended movies using MovieCard.
 * Click navigates to that movie's detail page.
 */

import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import type { TmdbMovie } from '../../types';
import { MovieCard } from '../MovieCard';

interface MovieDetailsRecommendationsProps {
  movies: TmdbMovie[];
}

const MAX_RECOMMENDATIONS = 10;

export function MovieDetailsRecommendations({ movies }: MovieDetailsRecommendationsProps): React.JSX.Element | null {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (movie: TmdbMovie): void => {
      navigate(`/movie/${movie.id}`);
    },
    [navigate],
  );

  if (movies.length === 0) return null;

  const displayMovies = movies.slice(0, MAX_RECOMMENDATIONS);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        More Like This
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {displayMovies.map((movie) => (
          <div key={movie.id} className="w-36 shrink-0">
            <MovieCard movie={movie} onSelect={handleSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}
