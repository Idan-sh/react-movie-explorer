/**
 * HomePage Component
 *
 * Main landing page. Composes shared and module components.
 * Default view shows preview rows, tab click shows full grid.
 * Keyboard navigation handled via usePageNavigation.
 */

import { useMemo, useCallback } from 'react';
import { AppHeader } from '@/shared/components';
import { useCategoryTabs } from '@/shared/hooks';
import { APP_VIEW, APP_VIEW_LABELS, APP_VIEW_TABS } from '@/shared/constants';
import { MovieGrid, useMoviesInit, useLoadMore, MOVIE_LIST, getListSelectors } from '@/modules/movies';
import { usePageNavigation, GRID_COLUMNS } from '@/modules/navigation';
import { useAppSelector } from '@/core/store';

export function HomePage(): React.JSX.Element {
  const { handleSelectMovie } = useMoviesInit();
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } = useCategoryTabs();

  // Movie data for navigation sections
  const popularMovies = useAppSelector(getListSelectors(MOVIE_LIST.POPULAR).selectMovies);
  const nowPlayingMovies = useAppSelector(getListSelectors(MOVIE_LIST.NOW_PLAYING).selectMovies);
  const hasMorePopular = useAppSelector(getListSelectors(MOVIE_LIST.POPULAR).selectHasMorePages);
  const hasMoreNowPlaying = useAppSelector(getListSelectors(MOVIE_LIST.NOW_PLAYING).selectHasMorePages);

  // Load more handlers for keyboard footer activation
  const loadMorePopular = useLoadMore(MOVIE_LIST.POPULAR);
  const loadMoreNowPlaying = useLoadMore(MOVIE_LIST.NOW_PLAYING);

  // Section items mapped by active view (order matches grid layout)
  const sectionItems = useMemo(() => {
    if (activeView === APP_VIEW.HOME) return [popularMovies, nowPlayingMovies];
    if (activeView === APP_VIEW.POPULAR) return [popularMovies];
    if (activeView === APP_VIEW.NOW_PLAYING) return [nowPlayingMovies];
    return [];
  }, [activeView, popularMovies, nowPlayingMovies]);

  // Footer flags per section (Load More button exists when more pages available)
  const sectionHasFooter = useMemo(() => {
    if (activeView === APP_VIEW.HOME) return [hasMorePopular, hasMoreNowPlaying];
    if (activeView === APP_VIEW.POPULAR) return [hasMorePopular];
    if (activeView === APP_VIEW.NOW_PLAYING) return [hasMoreNowPlaying];
    return [];
  }, [activeView, hasMorePopular, hasMoreNowPlaying]);

  // Maps section index → load more handler for keyboard Enter on footer
  const handleFooterActivate = useCallback((sectionIndex: number): void => {
    if (activeView === APP_VIEW.HOME) {
      (sectionIndex === 0 ? loadMorePopular : loadMoreNowPlaying)();
    } else if (activeView === APP_VIEW.POPULAR) {
      loadMorePopular();
    } else if (activeView === APP_VIEW.NOW_PLAYING) {
      loadMoreNowPlaying();
    }
  }, [activeView, loadMorePopular, loadMoreNowPlaying]);

  // Keyboard navigation
  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex } = usePageNavigation({
    tabCount: APP_VIEW_TABS.length,
    sectionItems,
    columns: GRID_COLUMNS,
    contentKey: activeView,
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: handleSelectMovie,
    onEscape: () => handleTabClick(APP_VIEW.HOME),
    sectionHasFooter,
    onFooterActivate: handleFooterActivate,
  });

  const renderContent = (): React.JSX.Element => {
    if (activeView === APP_VIEW.POPULAR) {
      return (
        <MovieGrid
          list={MOVIE_LIST.POPULAR}
          onSelectMovie={handleSelectMovie}
          sectionIndex={0}
          focusedIndex={focusedSectionIndex === 0 ? focusedItemIndex : -1}
        />
      );
    }

    if (activeView === APP_VIEW.NOW_PLAYING) {
      return (
        <MovieGrid
          list={MOVIE_LIST.NOW_PLAYING}
          onSelectMovie={handleSelectMovie}
          sectionIndex={0}
          focusedIndex={focusedSectionIndex === 0 ? focusedItemIndex : -1}
        />
      );
    }

    if (activeView === APP_VIEW.FAVORITES) {
      // TODO: Favorites module
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-4">❤️</span>
          <p className="text-lg font-medium">Favorites coming soon</p>
        </div>
      );
    }

    // Home view - preview rows
    return (
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {APP_VIEW_LABELS[APP_VIEW.POPULAR]}
          </h2>
          <MovieGrid
            list={MOVIE_LIST.POPULAR}
            onSelectMovie={handleSelectMovie}
            sectionIndex={0}
            focusedIndex={focusedSectionIndex === 0 ? focusedItemIndex : -1}
          />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {APP_VIEW_LABELS[APP_VIEW.NOW_PLAYING]}
          </h2>
          <MovieGrid
            list={MOVIE_LIST.NOW_PLAYING}
            onSelectMovie={handleSelectMovie}
            sectionIndex={1}
            focusedIndex={focusedSectionIndex === 1 ? focusedItemIndex : -1}
          />
        </section>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <AppHeader
        activeView={activeView}
        focusedTabIndex={focusedTabIndex}
        onTabClick={handleTabClick}
        onTabFocus={handleTabFocus}
        onTabBlur={handleTabBlur}
      />

      <main className="flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
