/**
 * FilmPlaceholder Component
 *
 * Reusable placeholder with a diagonal film-reel SVG pattern
 * and a centered film icon. Used as fallback for missing images.
 */

import { useId } from 'react';
import { FilmIcon } from '@heroicons/react/24/outline';

interface FilmPlaceholderProps {
  iconSize?: string;
}

export function FilmPlaceholder({
  iconSize = 'h-12 w-12',
}: FilmPlaceholderProps): React.JSX.Element {
  const patternId = useId();

  return (
    <div className="relative flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
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
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <FilmIcon className={`relative ${iconSize}`} />
    </div>
  );
}
