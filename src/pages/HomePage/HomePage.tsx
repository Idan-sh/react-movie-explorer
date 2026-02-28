/**
 * HomePage
 *
 * Route: /
 *
 * Composes content grid for the active tab.
 * Tab state comes from AppLayout via outlet context.
 * Syncs keyboard nav focus back to the layout header.
 *
 * When search is active (query >= 2 chars), replaces tab content
 * with TMDB search results via MovieGridLayout.
 * Keyboard nav is disabled while the search input is focused.
 */

import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { LayoutContext } from "@/shared/components";
import {
  APP_VIEW,
  APP_VIEW_CONFIG,
  APP_VIEW_TABS,
  VIEW_CROSSFADE,
  ROUTES
} from "@/shared/constants";
import { useLoadMore } from "@/shared/hooks";
import { useAppSelector, useAppDispatch } from "@/core/store";
import {
  MovieGrid,
  MovieGridLayout,
  useMoviesInit,
  getListSelectors,
  fetchMovies,
  showNextPage
} from "@/modules/movies";
import type { TmdbMovie } from "@/modules/movies";
import { FavoritesGrid, useFavoriteToggle, selectFavorites } from "@/modules/favorites";
import { usePageNavigation, useGridColumns } from "@/modules/navigation";
import { useSearchGrid } from "@/modules/search";

// Stable fallback selectors — used when activeList is null (e.g. Favorites tab).
// Defined at module level so their references never change between renders.
const EMPTY_MOVIES: TmdbMovie[] = [];
const selectNoMovies = (): TmdbMovie[] => EMPTY_MOVIES;
const selectFalse = (): boolean => false;
const selectZero = (): number => 0;

export function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeView, handleTabClick, setFocusedTabIndex, isSearchFocused } =
    useOutletContext<LayoutContext>();
  const { activeList } = useMoviesInit(activeView);
  const handleToggleFavorite = useFavoriteToggle();

  // Search grid state — provides MovieGridState + isActive + query
  const searchGrid = useSearchGrid(0);

  const handleSelectMovie = useCallback(
    (movie: TmdbMovie): void => {
      navigate(ROUTES.movieDetails(movie.id));
    },
    [navigate]
  );

  // Movie data for the active list (empty when no list, e.g., favorites).
  // getListSelectors returns stable references per list type (built once at module load),
  // so activeSelectors is stable as long as activeList doesn't change.
  const activeSelectors = activeList ? getListSelectors(activeList) : null;
  const movies = useAppSelector(activeSelectors?.selectMovies ?? selectNoMovies);
  const hasMorePages = useAppSelector(activeSelectors?.selectHasMorePages ?? selectFalse);
  const hasNextPage = useAppSelector(activeSelectors?.selectHasNextPage ?? selectFalse);
  const pageNumber = useAppSelector(activeSelectors?.selectPageNumber ?? selectZero);

  // Favorites data (always read — used for heart state and keyboard nav)
  const favorites = useAppSelector(selectFavorites);
  const favoriteIds = useMemo(() => new Set(favorites.map((m) => m.id)), [favorites]);

  const onMovieLoad = useCallback((): void => {
    if (!activeList) return;
    if (hasNextPage) dispatch(showNextPage({ list: activeList }));
    else dispatch(fetchMovies({ list: activeList, pageNumber: pageNumber + 1 }));
  }, [dispatch, activeList, hasNextPage, pageNumber]);

  // Keyboard-nav Load More for movie lists (own useLoadMore instance owns its scroll ref).
  // selectMovieCount / selectCanLoad are stable references from getListSelectors.
  const movieLoadMore = useLoadMore({
    itemCountSelector: activeSelectors?.selectMovieCount ?? selectZero,
    canLoadSelector: activeSelectors?.selectCanLoad ?? selectFalse,
    onLoad: onMovieLoad,
    sectionIndex: 0
  });

  const {
    isActive: isSearchActive,
    handleLoadMore: searchLoadMore,
    movies: searchMovies,
    hasMorePages: searchHasMorePages,
    query: searchQuery
  } = searchGrid;

  const handleFooterActivate = useCallback((): void => {
    if (isSearchActive) searchLoadMore();
    else movieLoadMore();
  }, [isSearchActive, searchLoadMore, movieLoadMore]);

  // Navigation sections: search results OR current tab items
  const sectionItems = useMemo(() => {
    if (isSearchActive) {
      return searchMovies.length > 0 ? [searchMovies] : [];
    }
    const active = activeList ? movies : activeView === APP_VIEW.FAVORITES ? favorites : [];
    return active.length > 0 ? [active] : [];
  }, [isSearchActive, searchMovies, activeList, movies, activeView, favorites]);

  const sectionHasFooter = useMemo(() => {
    if (isSearchActive) {
      return searchMovies.length > 0 ? [searchHasMorePages] : [];
    }
    return activeList ? [hasMorePages] : [];
  }, [isSearchActive, searchMovies, searchHasMorePages, activeList, hasMorePages]);

  const gridColumns = useGridColumns();

  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex } = usePageNavigation({
    tabCount: APP_VIEW_TABS.length,
    sectionItems,
    columns: gridColumns,
    contentKey: isSearchActive ? "search" : activeView,
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: handleSelectMovie,
    onEscape: () => {},
    sectionHasFooter,
    onFooterActivate: handleFooterActivate,
    activeTabIndex: APP_VIEW_TABS.indexOf(activeView),
    enabled: !isSearchFocused
  });

  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  const focusedIndex = focusedSectionIndex === 0 ? focusedItemIndex : -1;

  const searchEmptyNode = (
    <div className="py-16 text-center">
      <p className="text-gray-500 dark:text-gray-400">No results for &ldquo;{searchQuery}&rdquo;</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-8 md:px-10 lg:px-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSearchActive ? "search" : activeView}
          initial={VIEW_CROSSFADE.initial}
          animate={VIEW_CROSSFADE.animate}
          exit={VIEW_CROSSFADE.exit}
          transition={VIEW_CROSSFADE.transition}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            {isSearchActive
              ? "Search Results"
              : APP_VIEW_CONFIG[activeView as keyof typeof APP_VIEW_CONFIG].title}
          </h2>

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
