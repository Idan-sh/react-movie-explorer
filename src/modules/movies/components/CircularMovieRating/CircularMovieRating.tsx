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

import { useState, useEffect, useRef, useCallback } from "react";

export interface CircularMovieRatingProps {
  rating: number;
  size?: "sm" | "lg";
}

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ANIMATION_DURATION_MS = 800;

const SIZE_CONFIG = {
  sm: {
    container: "h-10 w-10",
    text: "text-[12px]",
    percent: "text-[6px]",
    strokeWidth: 1.5
  },
  lg: {
    container: "h-14 w-14",
    text: "text-sm",
    percent: "text-[8px]",
    strokeWidth: 2.5
  }
} as const;

function getColor(rating: number): string {
  if (rating >= 70) return "#22c55e";
  if (rating >= 50) return "#f59e0b";
  return "#ef4444";
}

function getTrackColor(rating: number): string {
  if (rating >= 70) return "#166534";
  if (rating >= 50) return "#78350f";
  return "#7f1d1d";
}

export function CircularMovieRating({
  rating,
  size = "sm"
}: CircularMovieRatingProps): React.JSX.Element {
  const [animatedValue, setAnimatedValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback((): void => {
    const start = performance.now();

    function tick(now: number): void {
      const elapsed = now - start;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValue(Math.round(eased * rating));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [rating]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasAnimated.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return (): void => {
      observer.disconnect();
    };
  }, [animate]);

  const config = SIZE_CONFIG[size];
  const offset = CIRCUMFERENCE - (animatedValue / 100) * CIRCUMFERENCE;
  const color = getColor(rating);
  const trackColor = getTrackColor(rating);

  return (
    <div
      ref={containerRef}
      className={`${config.container} relative flex items-center justify-center rounded-full bg-gray-900`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth={config.strokeWidth}
        />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
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
