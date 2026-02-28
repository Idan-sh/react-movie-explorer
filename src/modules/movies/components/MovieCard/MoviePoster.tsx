/**
 * MoviePoster Component
 *
 * Displays movie poster image with lazy loading.
 * Shows placeholder when no image available.
 */

import { FilmIcon } from '@heroicons/react/24/outline';

export interface MoviePosterProps {
  url: string | null;
  title: string;
}

export function MoviePoster({ url, title }: MoviePosterProps): React.JSX.Element {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      {url ? (
        <img
          src={url}
          alt={`${title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="film-pattern"
                width="40"
                height="28"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-30)"
              >
                <rect
                  x="4"
                  y="4"
                  width="32"
                  height="20"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="4" cy="14" r="2" fill="currentColor" />
                <circle cx="36" cy="14" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#film-pattern)" />
          </svg>
          <FilmIcon className="relative h-30 w-30" />
        </div>
      )}
    </div>
  );
}
