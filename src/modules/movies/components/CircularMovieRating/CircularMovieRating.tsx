/**
 * CircularMovieRating Component
 *
 * Animated circular progress donut displaying a percentage score.
 * Color-coded: green (≥70), yellow (≥50), red (<50).
 * Animates the arc fill and number count-up when entering the viewport.
 *
 * Two sizes:
 *   - sm (40px) — card poster overlay
 *   - lg (56px) — details page inline
 */

import { CIRCULAR_RATING } from "./circularMovieRating.constants";
import { useCircularMovieRating } from "./useCircularMovieRating";

export interface CircularMovieRatingProps {
  rating: number;
  size?: "sm" | "lg";
}

export function CircularMovieRating({
  rating,
  size = "sm",
}: CircularMovieRatingProps): React.JSX.Element {
  const { containerRef, animatedValue, offset, color, trackColor } =
    useCircularMovieRating(rating);

  const config = CIRCULAR_RATING.SIZE[size];

  return (
    <div
      ref={containerRef}
      className={`${config.container} relative flex items-center justify-center rounded-full bg-gray-900`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={CIRCULAR_RATING.RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={config.strokeWidth}
        />
        <circle
          cx="18"
          cy="18"
          r={CIRCULAR_RATING.RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCULAR_RATING.CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute ${config.text} font-bold text-white`}>
        {animatedValue}
        <span className={`${config.percent} font-bold align-super`}>%</span>
      </span>
    </div>
  );
}
