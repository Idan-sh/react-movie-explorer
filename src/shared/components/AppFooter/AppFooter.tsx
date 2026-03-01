/**
 * AppFooter Component
 *
 * App-wide footer with creator credit, TMDB attribution, and GitHub link.
 */

const CURRENT_YEAR = new Date().getFullYear();
const GITHUB_URL = 'https://github.com/idansh';
const TMDB_URL = 'https://www.themoviedb.org';

export function AppFooter(): React.JSX.Element {
  return (
    <footer className="shrink-0 border-t border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between sm:gap-0">
        {/* Creator credit */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {CURRENT_YEAR} Built by{' '}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:text-primary-hover transition-colors"
          >
            idansh
          </a>
        </p>

        {/* TMDB attribution */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Powered by</span>
          <a
            href={TMDB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:text-primary-hover transition-colors"
          >
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}
