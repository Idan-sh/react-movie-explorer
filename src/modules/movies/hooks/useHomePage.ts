/**
 * useHomePage Hook
 *
 * Orchestrates home page: tab view, movie lists, search grid, favorites, keyboard nav.
 * Returns props for the home content so the page component stays thin.
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '@/shared/components';
import {
  APP_VIEW,
  APP_VIEW_CONFIG,
  APP_VIEW_TABS,
  VIEW_CROSSFADE,
  ROUTES,
} from '@/shared/constants';
import { useLoadMore } from '@/shared/hooks';
import { useAppSelector, useAppDispatch } from '@/core/store';
import {
  useMoviesInit,
  getListSelectors,
  fetchMovies,
  showNextPage,
} from '@/modules/movies';
import type { TmdbMovie } from '@/modules/movies';
import { useFavoriteToggle, selectFavorites } from '@/modules/favorites';
import { usePageNavigation, useGridColumns } from '@/core/navigation';
import { useSearchGrid } from '@/modules/search';

const EMPTY_MOVIES: TmdbMovie[] = [];
const selectNoMovies = (): TmdbMovie[] => EMPTY_MOVIES;
const selectFalse = (): boolean => false;
const selectZero = (): number => 0;

export function useHomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeView, handleTabClick, setFocusedTabIndex, isSearchFocused } =
    useOutletContext<LayoutContext>();
  const { activeList } = useMoviesInit(activeView);
  const handleToggleFavorite = useFavoriteToggle();

  const searchGrid = useSearchGrid(0);

  const handleSelectMovie = useCallback(
    (movie: TmdbMovie): void => {
      navigate(ROUTES.movieDetails(movie.id), { viewTransition: true });
    },
    [navigate]
  );

  const activeSelectors = activeList ? getListSelectors(activeList) : null;
  const movies = useAppSelector(activeSelectors?.selectMovies ?? selectNoMovies);
  const hasMorePages = useAppSelector(activeSelectors?.selectHasMorePages ?? selectFalse);
  const hasNextPage = useAppSelector(activeSelectors?.selectHasNextPage ?? selectFalse);
  const pageNumber = useAppSelector(activeSelectors?.selectPageNumber ?? selectZero);

  const favorites = useAppSelector(selectFavorites);
  const favoriteIds = useMemo(() => new Set(favorites.map((m) => m.id)), [favorites]);

  const onMovieLoad = useCallback((): void => {
    if (!activeList) return;
    if (hasNextPage) dispatch(showNextPage({ list: activeList }));
    else dispatch(fetchMovies({ list: activeList, pageNumber: pageNumber + 1 }));
  }, [dispatch, activeList, hasNextPage, pageNumber]);

  const movieLoadMore = useLoadMore({
    itemCountSelector: activeSelectors?.selectMovieCount ?? selectZero,
    canLoadSelector: activeSelectors?.selectCanLoad ?? selectFalse,
    onLoad: onMovieLoad,
    sectionIndex: 0,
  });

  const {
    isActive: isSearchActive,
    handleLoadMore: searchLoadMore,
    movies: searchMovies,
    hasMorePages: searchHasMorePages,
    query: searchQuery,
  } = searchGrid;

  const handleFooterActivate = useCallback((): void => {
    if (isSearchActive) searchLoadMore();
    else movieLoadMore();
  }, [isSearchActive, searchLoadMore, movieLoadMore]);

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
    contentKey: isSearchActive ? 'search' : activeView,
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: handleSelectMovie,
    onEscape: () => {},
    sectionHasFooter,
    onFooterActivate: handleFooterActivate,
    activeTabIndex: APP_VIEW_TABS.indexOf(activeView),
    enabled: !isSearchFocused,
  });

  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  const focusedIndex = focusedSectionIndex === 0 ? focusedItemIndex : -1;

  return {
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
    VIEW_CROSSFADE,
    APP_VIEW,
    APP_VIEW_CONFIG,
  };
}
