/**
 * SearchBar Component
 *
 * Search input for the app header.
 * Expands on focus via CSS transition.
 * Purely presentational — all state and handlers received via props.
 */

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface SearchBarProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({
  query,
  onInputChange,
  onClear,
  onFocus,
  onBlur,
}: SearchBarProps): React.JSX.Element {
  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      />

      <input
        type="search"
        value={query}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search movies..."
        aria-label="Search movies"
        className="
          h-9 w-full md:w-56 rounded-lg
          bg-white/10 dark:bg-white/5
          border border-gray-300/40 dark:border-gray-600/40
          pl-9 pr-8
          text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          md:transition-[width] md:duration-200 md:focus:w-72
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {query && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
