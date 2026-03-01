/**
 * useIsMobile Hook
 *
 * Reactively tracks whether the viewport is below the md breakpoint (768px).
 * Uses matchMedia for efficiency — fires only when the boundary is crossed,
 * staying perfectly in sync with Tailwind's md: responsive variants.
 */

import { useState, useEffect } from 'react';
import { BREAKPOINT } from '@/shared/constants';

const MOBILE_QUERY = `(max-width: ${BREAKPOINT.MD - 1}px)`;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent): void => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
