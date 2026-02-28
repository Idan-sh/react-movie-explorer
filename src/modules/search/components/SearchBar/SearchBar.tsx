/**
 * SearchBar Component
 *
 * Search input for the app header.
 * Expands on focus via CSS transition.
 * Receives onFocus/onBlur from the layout to pause keyboard nav while typing.
 */

import { useSearch } from "../../hooks";

export interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({ onFocus, onBlur }: SearchBarProps): React.JSX.Element {
  const { query, handleChange, handleClear } = useSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleChange(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute left-3 text-gray-400 dark:text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search movies..."
        aria-label="Search movies"
        className="
          h-9 w-56 rounded-lg
          bg-white/10 dark:bg-white/5
          border border-gray-300/40 dark:border-gray-600/40
          pl-9 pr-8
          text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-[width] duration-200 focus:w-72
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
