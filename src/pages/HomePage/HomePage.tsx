/**
 * HomePage Component
 *
 * Main landing page displaying movie grid.
 * Business logic handled by movies module hook.
 */

import { AppHeader } from "@/shared/components";
import { MovieGrid, useMoviesInit } from "@/modules/movies";

export function HomePage(): React.JSX.Element {
  const { handleSelectMovie } = useMoviesInit();

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <AppHeader />

      {/* Content */}
      <main className="flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <MovieGrid onSelectMovie={handleSelectMovie} />
        </div>
      </main>
    </div>
  );
}
