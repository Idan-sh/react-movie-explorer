/**
 * MovieGrid Component
 *
 * Displays movies in a responsive grid layout.
 * Handles loading, empty, and error states via sub-components.
 */

import type { TmdbMovie, MovieList } from "../../types";
import { useMovieGrid } from "../../hooks";
import { MovieCard } from "../MovieCard";
import { MovieGridSkeleton } from "./MovieGridSkeleton";
import { MovieGridEmpty } from "./MovieGridEmpty";
import { MovieGridError } from "./MovieGridError";

export interface MovieGridProps {
  list: MovieList;
  onSelectMovie?: (movie: TmdbMovie) => void;
  focusedIndex?: number;
}

export function MovieGrid({ list, onSelectMovie, focusedIndex = -1 }: MovieGridProps): React.JSX.Element {
  const { movies, isLoading, hasError, error, isEmpty } = useMovieGrid(list);

  // Render content based on state priority: loading > error > empty > movies
  const renderContent = (): React.JSX.Element => {
    if (isLoading) {
      return <MovieGridSkeleton />;
    }

    if (hasError) {
      return <MovieGridError message={error} />;
    }

    if (isEmpty) {
      return <MovieGridEmpty />;
    }

    return (
      <>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
            isFocused={index === focusedIndex}
          />
        ))}
      </>
    );
  };

  return (
    <section
      aria-label="Movie grid"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
    >
      {renderContent()}
    </section>
  );
}
