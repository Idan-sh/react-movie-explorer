import { useState, useCallback } from 'react';

interface UseImageLoadReturn {
  hasError: boolean;
  handleError: () => void;
}

export function useImageLoad(src: string | undefined): UseImageLoadReturn {
  const [failedSrc, setFailedSrc] = useState<string>();

  const hasError = src !== undefined && src === failedSrc;

  const handleError = useCallback((): void => {
    setFailedSrc(src);
  }, [src]);

  return { hasError, handleError };
}
