import { useState, useEffect, useRef, useCallback } from "react";
import { CIRCULAR_RATING } from "./circularMovieRating.constants";
import { getRatingColor, getRatingTrackColor } from "./circularMovieRating.utils";

interface UseCircularMovieRatingReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  animatedValue: number;
  offset: number;
  color: string;
  trackColor: string;
}

export function useCircularMovieRating(rating: number): UseCircularMovieRatingReturn {
  const [animatedValue, setAnimatedValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback((): void => {
    const start = performance.now();

    function tick(now: number): void {
      const elapsed = now - start;
      const progress = Math.min(elapsed / CIRCULAR_RATING.ANIMATION_DURATION_MS, 1);
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

  const offset = CIRCULAR_RATING.CIRCUMFERENCE - (animatedValue / 100) * CIRCULAR_RATING.CIRCUMFERENCE;

  return {
    containerRef,
    animatedValue,
    offset,
    color: getRatingColor(rating),
    trackColor: getRatingTrackColor(rating),
  };
}
