/**
 * MovieRating Component
 *
 * Displays rating badge overlay on movie poster.
 */

export interface MovieRatingProps {
  rating: string;
}

export function MovieRating({ rating }: MovieRatingProps): React.JSX.Element {
  return (
    <div
      className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white"
      aria-hidden="true"
    >
      ⭐ {rating}
    </div>
  );
}
