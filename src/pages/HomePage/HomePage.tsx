/**
 * HomePage
 *
 * Route: /
 *
 * Composes content grid for the active tab.
 * Tab state comes from AppLayout via outlet context.
 * Syncs keyboard nav focus back to the layout header.
 */

import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { LayoutContext } from "@/shared/components";
import { APP_VIEW, APP_VIEW_TABS, VIEW_CROSSFADE, ROUTES } from "@/shared/constants";
import {
  MovieGrid,
  useMoviesInit,
  useLoadMore,
  MOVIE_LIST,
  getListSelectors
} from "@/modules/movies";
import type { TmdbMovie } from "@/modules/movies";
import { FavoritesGrid, useFavoriteToggle, selectFavorites } from "@/modules/favorites";
import { usePageNavigation, useGridColumns } from "@/modules/navigation";
import { useAppSelector } from "@/core/store";

export function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { activeView, handleTabClick, setFocusedTabIndex } = useOutletContext<LayoutContext>();
  const { activeList } = useMoviesInit(activeView);
  const handleToggleFavorite = useFavoriteToggle();

  const handleSelectMovie = useCallback(
    (movie: TmdbMovie): void => {
      navigate(ROUTES.movieDetails(movie.id));
    },
    [navigate]
  );

  // Movie data for the active list (empty when no list, e.g., favorites)
  const movies = useAppSelector(activeList ? getListSelectors(activeList).selectMovies : () => []);
  const hasMorePages = useAppSelector(
    activeList ? getListSelectors(activeList).selectHasMorePages : () => false
  );

  // Favorites data (always read — used for heart state and keyboard nav)
  const favorites = useAppSelector(selectFavorites);
  const favoriteIds = useMemo(() => new Set(favorites.map((m) => m.id)), [favorites]);

  // Load more handler (defaults to POPULAR, unused for favorites tab)
  const loadMore = useLoadMore(activeList ?? MOVIE_LIST.POPULAR);

  // Navigation: always 0 or 1 sections
  const sectionItems = useMemo(() => {
    const active = activeList ? movies : activeView === APP_VIEW.FAVORITES ? favorites : [];
    return active.length > 0 ? [active] : [];
  }, [activeList, movies, activeView, favorites]);

  const sectionHasFooter = useMemo(
    () => (activeList ? [hasMorePages] : []),
    [activeList, hasMorePages]
  );

  const gridColumns = useGridColumns();

  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex } = usePageNavigation({
    tabCount: APP_VIEW_TABS.length,
    sectionItems,
    columns: gridColumns,
    contentKey: activeView,
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: handleSelectMovie,
    onEscape: () => {},
    sectionHasFooter,
    onFooterActivate: loadMore,
    enabled: true
  });

  // Sync keyboard nav focus state up to the layout header
  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  const focusedIndex = focusedSectionIndex === 0 ? focusedItemIndex : -1;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-8 md:px-10 lg:px-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={VIEW_CROSSFADE.initial}
          animate={VIEW_CROSSFADE.animate}
          exit={VIEW_CROSSFADE.exit}
          transition={VIEW_CROSSFADE.transition}
        >
          {activeList ? (
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
