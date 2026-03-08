/**
 * useScrollHint Hook
 *
 * Detects wheel events on a scroll container when mouse scroll is disabled.
 * Shows a navigation hint for a fixed duration, then enters a cooldown
 * period before it can appear again.
 */

import { useState, useEffect, useRef } from 'react';

const DISPLAY_DURATION_MS = 4000;
const COOLDOWN_MS = 30000;

export interface UseScrollHintReturn {
  isHintVisible: boolean;
}

export function useScrollHint(
  scrollRef: React.RefObject<HTMLElement | null>,
  isScrollEnabled: boolean,
): UseScrollHintReturn {
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownUntilRef = useRef(0);

  useEffect(() => {
    if (isScrollEnabled) {
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      return;
    }

    const el = scrollRef.current;
    if (!el) return;

    function handleWheel(): void {
      if (Date.now() < cooldownUntilRef.current) return;
      if (hideTimerRef.current !== null) return;

      setIsHintVisible(true);

      hideTimerRef.current = setTimeout(() => {
        setIsHintVisible(false);
        hideTimerRef.current = null;
        cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
      }, DISPLAY_DURATION_MS);
    }

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isScrollEnabled, scrollRef]);

  return { isHintVisible: isHintVisible && !isScrollEnabled };
}
