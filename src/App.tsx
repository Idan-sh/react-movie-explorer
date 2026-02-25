/**
 * App Component
 *
 * Root application component. Composes header, tabs, and content grid.
 * Each tab lazy-loads its content when first opened.
 * Only one movie grid is visible at a time.
 */

import { useMemo, useCallback } from 'react';
import { AppHeader } from '@/shared/components';
import { useCategoryTabs } from '@/shared/hooks';
import { APP_VIEW_TABS } from '@/shared/constants';
import { MovieGrid, useMoviesInit, useLoadMore, MOVIE_LIST, getListSelectors } from '@/modules/movies';
import { usePageNavigation, GRID_COLUMNS } from '@/modules/navigation';
import { useAppSelector } from '@/core/store';

function App(): React.JSX.Element {
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } = useCategoryTabs();
  const { activeList, handleSelectMovie } = useMoviesInit(activeView);

  // Movie data for the active list (empty when no list, e.g., favorites)
  const movies = useAppSelector(
    activeList ? getListSelectors(activeList).selectMovies : () => []
  );
  const hasMorePages = useAppSelector(
    activeList ? getListSelectors(activeList).selectHasMorePages : () => false
  );

  // Load more handler for active list (defaults to POPULAR, unused for non-list views)
  const loadMore = useLoadMore(activeList ?? MOVIE_LIST.POPULAR);

  // Navigation: always 0 or 1 sections
  const sectionItems = useMemo(
    () => (activeList ? [movies] : []),
    [activeList, movies]
  );

  const sectionHasFooter = useMemo(
    () => (activeList ? [hasMorePages] : []),
    [activeList, hasMorePages]
  );

  const handleFooterActivate = useCallback((): void => {
    loadMore();
  }, [loadMore]);

  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex } = usePageNavigation({
    tabCount: APP_VIEW_TABS.length,
    sectionItems,
    columns: GRID_COLUMNS,
    contentKey: activeView,
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: handleSelectMovie,
    onEscape: () => {},
    sectionHasFooter,
    onFooterActivate: handleFooterActivate,
  });

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
          {activeList ? (
            <MovieGrid
              list={activeList}
              onSelectMovie={handleSelectMovie}
              sectionIndex={0}
              focusedIndex={focusedSectionIndex === 0 ? focusedItemIndex : -1}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <span className="text-4xl mb-4">❤️</span>
              <p className="text-lg font-medium">Favorites coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
