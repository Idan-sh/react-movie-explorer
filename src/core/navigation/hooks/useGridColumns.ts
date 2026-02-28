/**
 * useGridColumns Hook
 *
 * Returns the number of grid columns for the current viewport width,
 * matching the CSS breakpoints used in MovieGrid and FavoritesGrid:
 *   < 640px  (default) → 2 columns  (grid-cols-2)
 *   ≥ 640px  (sm)      → 3 columns  (sm:grid-cols-3)
 *   ≥ 768px  (md)      → 4 columns  (md:grid-cols-4)
 *
 * Uses matchMedia so it only re-renders when a breakpoint boundary is crossed,
 * not on every pixel of resize.
 */

import { useState, useEffect } from 'react';

const SM_QUERY = '(min-width: 640px)';
const MD_QUERY = '(min-width: 768px)';

function getColumns(): number {
  if (window.matchMedia(MD_QUERY).matches) return 4;
  if (window.matchMedia(SM_QUERY).matches) return 3;
  return 2;
}

export function useGridColumns(): number {
  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    const mdQuery = window.matchMedia(MD_QUERY);
    const smQuery = window.matchMedia(SM_QUERY);

    const update = (): void => setColumns(getColumns());

    mdQuery.addEventListener('change', update);
    smQuery.addEventListener('change', update);
    return () => {
      mdQuery.removeEventListener('change', update);
      smQuery.removeEventListener('change', update);
    };
  }, []);

  return columns;
}
