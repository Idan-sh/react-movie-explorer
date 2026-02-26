/**
 * MovieGrid Component
 *
 * Displays movies in a responsive grid layout with pagination.
 * Handles loading, empty, and error states via sub-components.
 *
 * STATE PRIORITY (no movies loaded):
 * - Initial loading → skeleton grid
 * - Initial error → full error
 * - Empty → empty message
 *
 * WHEN MOVIES EXIST:
 * - Loading more (fallback) → movies + skeleton cards appended
 * - Has more pages → movies + load more button
 */

import type { TmdbMovie, MovieList } from "../../types";
import { useMovieGrid } from "../../hooks";
import { buildNavId, NAV_ID_PREFIX } from "@/modules/navigation";
import { MovieCard } from "../MovieCard";
import { MovieGridSkeleton } from "./MovieGridSkeleton";
import { MovieGridEmpty } from "./MovieGridEmpty";
import { MovieGridError } from "./MovieGridError";
import { LoadMoreButton } from "./LoadMoreButton";

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
  const {
    movies,
    isLoading,
    isLoadingMore,
    hasError,
    error,
    isEmpty,
    hasMorePages,
    handleLoadMore,
  } = useMovieGrid(list, sectionIndex);

  // No movies yet — full-screen states
  if (isLoading && movies.length === 0) {
    return (
      <section aria-label="Movie grid">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          <MovieGridSkeleton />
        </div>
      </section>
    );
  }

  if (hasError && movies.length === 0) return <MovieGridError message={error} />;
  if (isEmpty) return <MovieGridEmpty />;

  // Has movies — render grid + pagination controls
  return (
    <section aria-label="Movie grid">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
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
          isLoading={false}
          hasError={hasError}
          isFocused={focusedIndex === movies.length}
          navId={buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, movies.length)}
          onClick={handleLoadMore}
        />
      )}
    </section>
  );
}
