/**
 * MovieGrid Component
 *
 * Container: reads movie list state from Redux via useMovieGrid,
 * then delegates all rendering to MovieGridLayout.
 */

import type { TmdbMovie, MovieList } from '../../types';
import { useMovieGrid } from '../../hooks';
import { MovieGridLayout } from './MovieGridLayout';

export interface MovieGridProps {
  list: MovieList;
  onSelectMovie?: (movie: TmdbMovie) => void;
  onToggleFavorite?: (movie: TmdbMovie) => void;
  favoriteIds?: Set<number>;
  focusedIndex?: number;
  sectionIndex?: number;
}

export function MovieGrid({
  list,
  onSelectMovie,
  onToggleFavorite,
  favoriteIds,
  focusedIndex = -1,
  sectionIndex = 0,
}: MovieGridProps): React.JSX.Element {
  const state = useMovieGrid(list, sectionIndex);

  return (
    <MovieGridLayout
      {...state}
      onSelectMovie={onSelectMovie}
      onToggleFavorite={onToggleFavorite}
      favoriteIds={favoriteIds}
      focusedIndex={focusedIndex}
      sectionIndex={sectionIndex}
    />
  );
}
