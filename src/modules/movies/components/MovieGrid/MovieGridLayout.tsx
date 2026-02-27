/**
 * MovieGridLayout Component
 *
 * Pure presenter — renders movie grid JSX from props.
 * No data fetching, no hooks.
 *
 * Used by MovieGrid (movie list) and any other consumer
 * that provides MovieGridState directly (e.g. search results).
 */

import type { TmdbMovie, MovieGridState } from '../../types';
import { buildNavId, NAV_ID_PREFIX } from '@/modules/navigation';
import { MovieCard } from '../MovieCard';
import { MovieGridSkeleton } from './MovieGridSkeleton';
import { MovieGridEmpty } from './MovieGridEmpty';
import { MovieGridError } from './MovieGridError';
import { LoadMoreButton } from './LoadMoreButton';

const GRID_CLASS = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6';

export interface MovieGridLayoutProps extends MovieGridState {
  onSelectMovie?: (movie: TmdbMovie) => void;
  onToggleFavorite?: (movie: TmdbMovie) => void;
  favoriteIds?: Set<number>;
  focusedIndex?: number;
  sectionIndex?: number;
  /** Custom empty state — overrides the default MovieGridEmpty */
  emptyNode?: React.ReactNode;
}

export function MovieGridLayout({
  movies,
  isLoading,
  isLoadingMore,
  hasError,
  error,
  isEmpty,
  hasMorePages,
  handleLoadMore,
  onSelectMovie,
  onToggleFavorite,
  favoriteIds,
  focusedIndex = -1,
  sectionIndex = 0,
  emptyNode,
}: MovieGridLayoutProps): React.JSX.Element {
  if (isLoading && movies.length === 0) {
    return (
      <section aria-label="Movie grid">
        <div className={GRID_CLASS}>
          <MovieGridSkeleton />
        </div>
      </section>
    );
  }

  if (hasError && movies.length === 0) return <MovieGridError message={error} />;
  if (isEmpty) return <>{emptyNode ?? <MovieGridEmpty />}</>;

  return (
    <section aria-label="Movie grid">
      <div className={GRID_CLASS}>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
            onToggleFavorite={onToggleFavorite}
            isFavorited={favoriteIds?.has(movie.id) ?? false}
            isFocused={index === focusedIndex}
            navId={buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, index)}
          />
        ))}

        {isLoadingMore && <MovieGridSkeleton />}
      </div>

      {!isLoadingMore && hasMorePages && (
        <LoadMoreButton
          hasError={hasError}
          isFocused={focusedIndex === movies.length}
          navId={buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, movies.length)}
          onClick={handleLoadMore}
        />
      )}
    </section>
  );
}
