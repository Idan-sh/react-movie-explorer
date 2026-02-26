/**
 * useScrollToTop Hook
 *
 * Tracks scroll position on a given container element.
 * Shows a "scroll to top" indicator when:
 * 1. User has scrolled past a threshold
 * 2. User has stopped scrolling (idle for a debounce period)
 *
 * Hides immediately when scrolling resumes.
 */

import { useState, useEffect, useRef, useCallback } from "react";

const SCROLL_THRESHOLD_PX = 600;
const IDLE_DELAY_MS = 200;

export interface UseScrollToTopReturn {
  scrollRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  scrollToTop: () => void;
}

export function useScrollToTop(): UseScrollToTopReturn {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll(): void {
      // Hide immediately while scrolling
      setIsVisible(false);

      // Clear any pending idle timer
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }

      // After user stops scrolling, check if past threshold
      idleTimerRef.current = setTimeout(() => {
        if (scrollRef.current && scrollRef.current.scrollTop > SCROLL_THRESHOLD_PX) {
          setIsVisible(true);
        }
      }, IDLE_DELAY_MS);
    }

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const scrollToTop = useCallback((): void => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setIsVisible(false);
  }, []);

  return { scrollRef, isVisible, scrollToTop };
}
