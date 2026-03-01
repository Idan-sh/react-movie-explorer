/**
 * useIsMobile Hook
 *
 * Reactively tracks whether the viewport is below the lg breakpoint (1024px).
 * Uses matchMedia for efficiency — fires only when the boundary is crossed,
 * staying perfectly in sync with the header's lg: responsive variants.
 */

import { useState, useEffect } from 'react';
import { MOBILE_QUERY } from '@/shared/constants';

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
