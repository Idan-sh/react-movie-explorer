/**
 * MovieRating Component
 *
 * Displays rating badge overlay on movie poster.
 */

import { StarIcon } from '@heroicons/react/20/solid';

export interface MovieRatingProps {
  rating: string;
}

export function MovieRating({ rating }: MovieRatingProps): React.JSX.Element {
  return (
    <div
      className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white"
      aria-hidden="true"
    >
      <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
      {rating}
    </div>
  );
}
