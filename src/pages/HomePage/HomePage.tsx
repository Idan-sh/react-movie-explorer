/**
 * HomePage Component
 *
 * Main landing page. Composes shared and module components.
 * Default view shows preview rows, tab click shows full grid.
 */

import { AppHeader } from '@/shared/components';
import { useCategoryTabs } from '@/shared/hooks';
import { MovieGrid, useMoviesInit } from '@/modules/movies';

export function HomePage(): React.JSX.Element {
  const { handleSelectMovie } = useMoviesInit();
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } = useCategoryTabs();

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <AppHeader
        activeView={activeView}
        onTabClick={handleTabClick}
        onTabFocus={handleTabFocus}
        onTabBlur={handleTabBlur}
      />

      {/* Content */}
      <main className="flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <MovieGrid onSelectMovie={handleSelectMovie} />
        </div>
      </main>
    </div>
  );
}
