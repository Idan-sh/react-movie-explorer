/**
 * FavoritesGrid Component
 *
 * Renders the user's favorited movies in a grid.
 * All cards shown are favorited — clicking the heart removes them.
 * Receives favorites from parent (App already reads them for keyboard nav).
 */

import type { TmdbMovie } from '@/modules/movies';
import { MovieCard } from '@/modules/movies';
import { buildNavId, NAV_ID_PREFIX } from '@/modules/navigation';
import { FavoritesEmpty } from './FavoritesEmpty';

export interface FavoritesGridProps {
  favorites: TmdbMovie[];
  onSelectMovie?: (movie: TmdbMovie) => void;
  onToggleFavorite: (movie: TmdbMovie) => void;
  focusedIndex?: number;
  sectionIndex?: number;
}

export function FavoritesGrid({
  favorites,
  onSelectMovie,
  onToggleFavorite,
  focusedIndex = -1,
  sectionIndex = 0,
}: FavoritesGridProps): React.JSX.Element {
  if (favorites.length === 0) return <FavoritesEmpty />;

  return (
    <section aria-label="Favorites grid">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {favorites.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
            onToggleFavorite={onToggleFavorite}
            isFavorited={true}
            isFocused={index === focusedIndex}
            navId={buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, index)}
          />
        ))}
      </div>
    </section>
  );
}
