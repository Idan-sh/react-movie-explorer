/**
 * CircularMovieRating Component
 *
 * Animated circular progress donut displaying a percentage score.
 * Color-coded: green (≥70), yellow (≥50), red (<50).
 * Animates via direct DOM updates (no React re-renders during animation).
 *
 * Two sizes:
 *   - sm (40px) — card poster overlay
 *   - lg (56px) — details page inline
 */

import { CIRCULAR_RATING } from './circularMovieRating.constants';
import { useCircularMovieRating } from './useCircularMovieRating';

export interface CircularMovieRatingProps {
  rating: number;
  size?: 'sm' | 'lg';
}

export function CircularMovieRating({
  rating,
  size = 'sm',
}: CircularMovieRatingProps): React.JSX.Element {
  const { containerRef, numberRef, arcRef, color, trackColor } =
    useCircularMovieRating(rating);

  const config = CIRCULAR_RATING.SIZE[size];

  return (
    <div
      ref={containerRef}
      role="meter"
      aria-valuenow={rating}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Rating: ${rating}%`}
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
          ref={arcRef}
          cx="18"
          cy="18"
          r={CIRCULAR_RATING.RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCULAR_RATING.CIRCUMFERENCE}
          strokeDashoffset={CIRCULAR_RATING.CIRCUMFERENCE}
        />
      </svg>
      <span className={`absolute ${config.text} font-bold text-white`}>
        <span ref={numberRef}>0</span>
        <span className={`${config.percent} font-bold align-super`}>%</span>
      </span>
    </div>
  );
}
