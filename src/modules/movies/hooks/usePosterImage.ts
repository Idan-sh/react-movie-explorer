/**
 * usePosterImage Hook
 *
 * Manages poster image load state: resets error when url changes,
 * exposes whether to show placeholder and an onError handler.
 */

import { useState, useEffect, useCallback } from 'react';

export interface UsePosterImageReturn {
  showPlaceholder: boolean;
  handleError: () => void;
}

export function usePosterImage(url: string | null): UsePosterImageReturn {
  const [loadError, setLoadError] = useState(false);
  const showPlaceholder = !url || loadError;

  useEffect(() => {
    setLoadError(false);
  }, [url]);

  const handleError = useCallback((): void => {
    setLoadError(true);
  }, []);

  return { showPlaceholder, handleError };
}
