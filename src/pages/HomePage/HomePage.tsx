/**
 * HomePage
 *
 * Route: /
 *
 * Thin shell: delegates to useHomePage and renders the home content.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { MovieGrid, MovieGridLayout, useHomePage } from '@/modules/movies';
import { FavoritesGrid } from '@/modules/favorites';
import { APP_VIEW, APP_VIEW_CONFIG, VIEW_CROSSFADE } from '@/shared/constants';

export function HomePage(): React.JSX.Element {
  const {
    isSearchActive,
    activeView,
    searchGrid,
    searchQuery,
    handleSelectMovie,
    handleToggleFavorite,
    favoriteIds,
    activeList,
    favorites,
    focusedIndex,
  } = useHomePage();

  const searchEmptyNode = (
    <div className="py-16 text-center">
      <p className="text-gray-500 dark:text-gray-400">
        No results for &ldquo;{searchQuery}&rdquo;
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 pb-10 sm:px-8 md:px-10 lg:px-20">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isSearchActive ? 'search' : activeView}
          initial={VIEW_CROSSFADE.initial}
          animate={VIEW_CROSSFADE.animate}
          exit={VIEW_CROSSFADE.exit}
          transition={VIEW_CROSSFADE.transition}
        >
          <div className="mb-6 inline-block">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {isSearchActive
                ? 'Search Results'
                : APP_VIEW_CONFIG[activeView as keyof typeof APP_VIEW_CONFIG]
                    .title}
            </h2>
            <motion.div
              className="mt-[-3px] h-0.5 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            />
          </div>

          {isSearchActive ? (
            <MovieGridLayout
              {...searchGrid}
              onSelectMovie={handleSelectMovie}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
              sectionIndex={0}
              focusedIndex={focusedIndex}
              emptyNode={searchEmptyNode}
            />
          ) : activeList ? (
            <MovieGrid
              list={activeList}
              onSelectMovie={handleSelectMovie}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
              sectionIndex={0}
              focusedIndex={focusedIndex}
            />
          ) : activeView === APP_VIEW.FAVORITES ? (
            <FavoritesGrid
              favorites={favorites}
              onSelectMovie={handleSelectMovie}
              onToggleFavorite={handleToggleFavorite}
              sectionIndex={0}
              focusedIndex={focusedIndex}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
