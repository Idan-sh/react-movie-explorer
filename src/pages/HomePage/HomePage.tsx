/**
 * HomePage Component
 *
 * Main landing page displaying movie grid.
 * Business logic handled by movies module hook.
 */

import { MovieGrid, useMoviesInit } from '@/modules/movies';

export function HomePage(): React.JSX.Element {
  const { handleSelectMovie } = useMoviesInit();

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎬 Movie Explorer
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <MovieGrid onSelectMovie={handleSelectMovie} />
      </div>
    </main>
  );
}
