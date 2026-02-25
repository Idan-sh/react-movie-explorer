/**
 * HomePage Component
 *
 * Main landing page. Composes shared and module components.
 * Default view shows preview rows, tab click shows full grid.
 */

import { AppHeader } from '@/shared/components';
import { useCategoryTabs } from '@/shared/hooks';
import { APP_VIEW, APP_VIEW_LABELS } from '@/shared/constants';
import { MovieGrid, useMoviesInit, MOVIE_LIST } from '@/modules/movies';

export function HomePage(): React.JSX.Element {
  const { handleSelectMovie } = useMoviesInit();
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } = useCategoryTabs();

  const renderContent = (): React.JSX.Element => {
    if (activeView === APP_VIEW.POPULAR) {
      return <MovieGrid list={MOVIE_LIST.POPULAR} onSelectMovie={handleSelectMovie} />;
    }

    if (activeView === APP_VIEW.NOW_PLAYING) {
      return <MovieGrid list={MOVIE_LIST.NOW_PLAYING} onSelectMovie={handleSelectMovie} />;
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
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{APP_VIEW_LABELS[APP_VIEW.POPULAR]}</h2>
          <MovieGrid list={MOVIE_LIST.POPULAR} onSelectMovie={handleSelectMovie} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{APP_VIEW_LABELS[APP_VIEW.NOW_PLAYING]}</h2>
          <MovieGrid list={MOVIE_LIST.NOW_PLAYING} onSelectMovie={handleSelectMovie} />
        </section>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <AppHeader
        activeView={activeView}
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
