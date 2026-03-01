/**
 * useHomePage Hook
 *
 * Orchestrates home page: tab view, movie lists, search grid, favorites, keyboard nav.
 * Returns props for the home content so the page component stays thin.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '@/shared/components';
import {
  APP_VIEW,
  APP_VIEW_TABS,
  HEADER_NAV_COUNT,
  ROUTES,
  STORAGE_KEY,
} from '@/shared/constants';
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from '@/shared/utils';
import { NAV_ZONE } from '@/core/navigation';
import { useLoadMore } from '@/shared/hooks';
import { useAppSelector, useAppDispatch } from '@/core/store';
import {
  useMoviesInit,
  getListSelectors,
  fetchMovies,
  showNextPage,
} from '@/modules/movies';
import type { TmdbMovie, MovieList } from '@/modules/movies';
import {
  useFavoriteToggle,
  selectFavorites,
  selectFavoriteIds,
} from '@/modules/favorites';
import { usePageNavigation, useGridColumns } from '@/core/navigation';
import { useSearchGrid } from '@/modules/search';
import type { UseSearchGridReturn } from '@/modules/search';
import type { AppView } from '@/shared/types';

const EMPTY_MOVIES: TmdbMovie[] = [];
const selectNoMovies = (): TmdbMovie[] => EMPTY_MOVIES;
const selectFalse = (): boolean => false;
const selectZero = (): number => 0;

export interface UseHomePageReturn {
  isSearchActive: boolean;
  activeView: AppView;
  searchGrid: UseSearchGridReturn;
  searchQuery: string;
  handleSelectMovie: (movie: TmdbMovie) => void;
  handleToggleFavorite: (movie: TmdbMovie) => void;
  favoriteIds: Set<number>;
  activeList: MovieList | null;
  favorites: TmdbMovie[];
  focusedIndex: number;
}

export function useHomePage(): UseHomePageReturn {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    activeView,
    handleTabClick,
    setFocusedTabIndex,
    onHeaderActivate,
    isNavDisabled,
    enterContentRef,
  } = useOutletContext<LayoutContext>();
  const { activeList } = useMoviesInit(activeView);
  const handleToggleFavorite = useFavoriteToggle();

  const searchGrid = useSearchGrid(0);

  // Restore focused card position after returning from movie details
  const [returnIndex] = useState(() => {
    const stored = getSessionItem(STORAGE_KEY.NAV.FOCUSED_INDEX);
    removeSessionItem(STORAGE_KEY.NAV.FOCUSED_INDEX);
    return stored !== null ? parseInt(stored, 10) : -1;
  });

  const focusedIndexRef = useRef(-1);

  const handleSelectMovie = useCallback(
    (movie: TmdbMovie): void => {
      setSessionItem(
        STORAGE_KEY.NAV.FOCUSED_INDEX,
        String(focusedIndexRef.current),
      );
      navigate(ROUTES.movieDetails(movie.id), { viewTransition: true });
    },
    [navigate],
  );

  const activeSelectors = activeList ? getListSelectors(activeList) : null;
  const movies = useAppSelector(
    activeSelectors?.selectMovies ?? selectNoMovies,
  );
  const hasMorePages = useAppSelector(
    activeSelectors?.selectHasMorePages ?? selectFalse,
  );
  const hasNextPage = useAppSelector(
    activeSelectors?.selectHasNextPage ?? selectFalse,
  );
  const pageNumber = useAppSelector(
    activeSelectors?.selectPageNumber ?? selectZero,
  );

  const favorites = useAppSelector(selectFavorites);
  const favoriteIdList = useAppSelector(selectFavoriteIds);
  const favoriteIds = useMemo(() => new Set(favoriteIdList), [favoriteIdList]);

  const onMovieLoad = useCallback((): void => {
    if (!activeList) return;
    if (hasNextPage) dispatch(showNextPage({ list: activeList }));
    else
      dispatch(fetchMovies({ list: activeList, pageNumber: pageNumber + 1 }));
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
    let active: TmdbMovie[] = [];
    if (activeList) active = movies;
    else if (activeView === APP_VIEW.FAVORITES) active = favorites;
    return active.length > 0 ? [active] : [];
  }, [isSearchActive, searchMovies, activeList, movies, activeView, favorites]);

  const sectionHasFooter = useMemo(() => {
    if (isSearchActive) {
      return searchMovies.length > 0 ? [searchHasMorePages] : [];
    }
    return activeList ? [hasMorePages] : [];
  }, [
    isSearchActive,
    searchMovies,
    searchHasMorePages,
    activeList,
    hasMorePages,
  ]);

  const gridColumns = useGridColumns();

  const handleTabActivate = useCallback(
    (index: number): void => {
      if (index < APP_VIEW_TABS.length) {
        handleTabClick(APP_VIEW_TABS[index]);
      } else {
        onHeaderActivate(index);
      }
    },
    [handleTabClick, onHeaderActivate],
  );

  const {
    focusedTabIndex,
    focusedSectionIndex,
    focusedItemIndex,
    enterContent,
  } = usePageNavigation({
    tabCount: HEADER_NAV_COUNT,
    sectionItems,
    columns: gridColumns,
    contentKey: isSearchActive ? 'search' : activeView,
    onTabActivate: handleTabActivate,
    onItemActivate: handleSelectMovie,
    sectionHasFooter,
    onFooterActivate: handleFooterActivate,
    activeTabIndex: APP_VIEW_TABS.indexOf(activeView),
    enabled: !isNavDisabled,
    enterContentTabCount: APP_VIEW_TABS.length,
    initialZone: returnIndex >= 0 ? NAV_ZONE.CONTENT : undefined,
    initialItemIndex: returnIndex >= 0 ? returnIndex : undefined,
    initialScrollBehavior: returnIndex >= 0 ? 'instant' : undefined,
  });

  useEffect(() => {
    enterContentRef.current = enterContent;
  }, [enterContentRef, enterContent]);

  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  const focusedIndex = focusedSectionIndex === 0 ? focusedItemIndex : -1;
  focusedIndexRef.current = focusedIndex;

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
  };
}
